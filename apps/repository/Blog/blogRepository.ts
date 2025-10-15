import { prisma } from "@/config/prismaClient";
import { AppError } from "@/types/error/AppError";
import { BlogSearchFilter } from "@/types/blog/blogRequest";

export class BlogRepository {
    /**
     * Search and filter blogs by keyword, tag, author, date
     */
    async searchBlogs(filter: BlogSearchFilter) {
        const { keyword, interest_id, author, date, page = 1, page_size = 10 } = filter;
        const where: any = {};

        if (keyword) {
            where.OR = [
                { title: { contains: keyword, mode: "insensitive" } },
                { description: { contains: keyword, mode: "insensitive" } },
                { html_output: { contains: keyword, mode: "insensitive" } }
            ];
        }
        // No author field in Blog schema, so skip author
        if (date) {
            // Assuming date is in YYYY-MM-DD format
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                where.created_at = {
                    gte: new Date(dateObj.setHours(0, 0, 0, 0)),
                    lt: new Date(dateObj.setHours(23, 59, 59, 999))
                };
            }
        }

        // Filter by interest_id using BlogInterest join table
        let blogWhere = where;
        let include: any = {
            blogInterests: {
                select: { interest_id: true }
            }
        };
        if (interest_id && Array.isArray(interest_id) && interest_id.length > 0) {
            // Only return blogs that have ALL matching interests
            blogWhere = {
                ...where,
                AND: interest_id.map((id) => ({
                    blogInterests: {
                        some: { interest_id: id }
                    }
                }))
            };
        }

        try {
            const [blogs, total] = await Promise.all([
                prisma.blog.findMany({
                    where: blogWhere,
                    include,
                    orderBy: { created_at: "desc" },
                    skip: (page - 1) * page_size,
                    take: page_size,
                }),
                prisma.blog.count({
                    where: blogWhere
                }),
            ]);
            return {
                data: blogs,
                page,
                page_size,
                total,
                total_pages: Math.ceil(total / page_size),
            };
        } catch (error) {
            console.error(error);
            throw new AppError("Failed to search blogs", 500);
        }
    }
}
