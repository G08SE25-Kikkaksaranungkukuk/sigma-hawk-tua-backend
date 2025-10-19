import { prisma } from "@/config/prismaClient";
import { AppError } from "@/types/error/AppError";
import { BlogSearchFilter } from "@/types/blog/blogRequest";
import axios from "axios";
import { config } from "@/config/config";
import { blogCreateReq } from "@/types/blog/blogRequest";
import { Blog, LikeBlog } from "@/prisma/index";

export class BlogRepository {
    async uploadMedia(
        image: Express.Multer.File | undefined
    ): Promise<string> {
        if (!image) throw new AppError("Image is not uploaded", 400);
        const f = image.originalname.split(".");
        const uploadPath = `/public/blog/media/${f.at(0)}_${Date.now()}.${f.at(-1)}`;
        const ret = await axios.put(
            config.FILE_SERVER_URL + uploadPath,
            image.buffer
        );
        return uploadPath
    }

    async createBlog(
        user_id : number,
        dat : blogCreateReq
    ) : Promise<number> {
        const ret = await prisma.blog.create({
            data : {
                'user_id' : user_id,
                ...dat
            }
        })
        return ret.blog_id
    }

    async getMyBlog(
        user_id : number | undefined
    ) : Promise<Blog[]> {
        const ret = await prisma.blog.findMany({
            where : {
                "user_id" : user_id
            }, include : {
                likes: true
            }
        })
        return ret
    }

    async getLikes(
        user_id : number,
        blog_id : string
    ) : Promise<Number> {
        try {
            const likeCount = await prisma.likeBlog.count({
                where : {
                    "user_id" : user_id,
                    "blog_id" : Number(blog_id)
                }
            })
            return likeCount;
        } catch (error : any) {
            return 0;
        }
    }

    async isUserLike(
        user_id : number,
        blog_id : string
    ) : Promise<Boolean> {
        try {
            await prisma.likeBlog.findFirstOrThrow({
                where : {
                    "user_id" : user_id,
                    "blog_id" : Number(blog_id)
                }
            })
            return true;
        } catch (error : any) {
            return false;
        }
    }

    async userLike(
        user_id : number,
        blog_id : string
    ) : Promise<number> {
        const ret = await prisma.likeBlog.create({
            data : {
                'user_id' : user_id,
                'blog_id' : Number(blog_id)
            }
        })
        return ret.like_id
    }

    async userUnlike(
        user_id : number,
        blog_id : string
    ) : Promise<void> {
        try {
            await prisma.likeBlog.findFirstOrThrow({
                where : {
                    "user_id" : user_id,
                    "blog_id" : Number(blog_id)
                }
            })

            await prisma.likeBlog.deleteMany({
                where : {
                    "user_id" : user_id,
                    "blog_id" : Number(blog_id)
                }
            })
        } catch (error : any) {

        }
    }

    async getBlogManifest(
        user_id : number,
        blog_id : string
    ) : Promise<Blog> {
        const blogData = await prisma.blog.findFirstOrThrow({
            where : {
                "blog_id" : Number(blog_id),
                "user_id" : user_id
            }
        })
        return blogData
    }

    async updateBlog(
        user_id : number,
        blog_id : string,
        dat : blogCreateReq
    ) : Promise<Blog> {
        
        await prisma.blog.findFirstOrThrow({
            where : {
                "user_id" : user_id,
                "blog_id" : Number(blog_id)
            }
        })
        
        const blogData = await prisma.blog.update({
            where : {
                "user_id" : user_id,
                "blog_id" : Number(blog_id)
            },
            data : dat
        })

        return blogData
    }

    async deleteBlog(user_id : number , blog_id : string) : Promise<void> {
        await prisma.blog.findFirstOrThrow({
            where : {
                "user_id" : user_id,
                "blog_id" : Number(blog_id)
            }
        })

        await prisma.blog.delete({
            where : {
                "user_id" : user_id,
                "blog_id" : Number(blog_id)
            }
        })
    }

    async getBlogContent(blog_id : string) : Promise<string> {
        const ret = await prisma.blog.findFirstOrThrow({
            where : {
                "blog_id" : Number(blog_id)
            }
        })
        return ret.html_output
    }

    /**
     * Search and filter blogs by keyword, interest_id, date
     */
    async searchBlogs(filter: BlogSearchFilter) {
        const { keyword, interest_id, date, sort_by, page = 1, page_size = 10 } = filter;
        const where: any = {};

        if (keyword) {
            where.OR = [
                { title: { contains: keyword, mode: "insensitive" } },
                { description: { contains: keyword, mode: "insensitive" } },
                { html_output: { contains: keyword, mode: "insensitive" } }
            ];
        }
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

        // Filter by interest_id using blog_interests join table
        let blogWhere = where;
        let include: any = {
            blog_interests: {
                select: { interest_id: true }
            },
            // include likes so consumers can know like info and Prisma can order by relation count
            likes: true
        };
        if (interest_id && Array.isArray(interest_id) && interest_id.length > 0) {
            // Only return blogs that have ALL matching interests
            blogWhere = {
                ...where,
                AND: interest_id.map((id) => ({
                    blog_interests: {
                        some: { interest_id: id }
                    }
                }))
            };
        }

        // determine order by
        let orderBy: any = { created_at: "desc" };
        if (sort_by) {
            const s = String(sort_by).toLowerCase();
            if (s === 'oldest') orderBy = { created_at: 'asc' };
            else if (s === 'newest') orderBy = { created_at: 'desc' };
            else if (s === 'most_like' || s === 'most-like' || s === 'most like') orderBy = { likes: { _count: 'desc' } };
        }

        try {
            const [blogs, total] = await Promise.all([
                prisma.blog.findMany({
                    where: blogWhere,
                    include,
                    orderBy,
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
