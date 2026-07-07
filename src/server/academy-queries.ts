import { logDatabaseFallback } from "@/lib/database-state";
import { prisma } from "@/lib/prisma";

export async function getFicoAcademyData() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: {
              orderBy: { sequence: "asc" },
            },
            practiceTasks: {
              orderBy: { sequence: "asc" },
            },
            quizQuestions: true,
          },
          orderBy: { sequence: "asc" },
        },
      },
      orderBy: { sequence: "asc" },
    });

    const progress = await prisma.learnerProgress.findMany({
      where: { learnerId: "demo" },
    });

    return { courses, progress, isDatabaseReady: true };
  } catch (error) {
    logDatabaseFallback("fico academy", error);

    return { courses: [], progress: [], isDatabaseReady: false };
  }
}

export type AcademyCourse = Awaited<ReturnType<typeof getFicoAcademyData>>["courses"][number];
