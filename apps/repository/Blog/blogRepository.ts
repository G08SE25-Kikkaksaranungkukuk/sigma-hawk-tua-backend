import { prisma } from "@/config/prismaClient";
import { AppError } from "@/types/error/AppError";
import { BlogSearchFilter } from "@/services/blog/blogService";

export class BlogRepository {
    /**
     * Search and filter blogs by keyword, tag, author, date
     */
    async searchBlogs(filter: BlogSearchFilter) {
        const { keyword, tag, author, date, page = 1, page_size = 10 } = filter;
        const where: any = {};

        if (keyword) {
            where.OR = [
                { title: { contains: keyword, mode: "insensitive" } },
                { description: { contains: keyword, mode: "insensitive" } },
                { html_output: { contains: keyword, mode: "insensitive" } }
            ];
        }
        // No tag or author fields in Blog schema, so skip those
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

        try {
            const [blogs, total] = await Promise.all([
                prisma.blog.findMany({
                    where,
                    orderBy: { created_at: "desc" },
                    skip: (page - 1) * page_size,
                    take: page_size,
                }),
                prisma.blog.count({ where }),
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
