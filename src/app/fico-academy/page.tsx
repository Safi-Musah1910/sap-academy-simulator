import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, CheckCircle2, Clock3, GraduationCap } from "lucide-react";

import { AppShell } from "@/components/dashboard/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFicoAcademyData } from "@/server/academy-queries";

export const dynamic = "force-dynamic";

export default async function FicoAcademyPage() {
  const { courses, progress, isDatabaseReady } = await getFicoAcademyData();
  const completedKeys = new Set(
    progress.filter((item) => item.status === "Completed").map((item) => item.progressKey),
  );

  return (
    <AppShell activePath="/fico-academy">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge>FICO Academy</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
                SAP FICO Training Platform
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Follow structured learning paths across Financial Accounting and Controlling,
                then reinforce each concept with simulator labs, guided practice, and challenge tasks.
              </p>
            </div>
            <Button asChild>
              <Link href="/sap-gui-reference">
                Start first interactive lesson
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </section>

        {!isDatabaseReady ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            The learning database is not initialized yet. Deploy migrations and seed the curriculum,
            then refresh this page.
          </div>
        ) : null}

        {courses.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
              <GraduationCap className="size-10 text-blue-700" />
              <h3 className="mt-4 text-base font-semibold text-slate-950">No courses available yet</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Seed the SAP FICO curriculum to populate learning paths, modules, lessons, practice
                labs, and challenge tasks.
              </p>
            </CardContent>
          </Card>
        ) : null}

        {courses.map((course) => {
          const totalLessons = course.modules.reduce(
            (sum, module) => sum + module.lessons.length,
            0,
          );
          const completedLessons = course.modules.reduce(
            (sum, module) =>
              sum +
              module.lessons.filter((lesson) => completedKeys.has(`demo:lesson:${lesson.slug}`))
                .length,
            0,
          );
          const completion = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          return (
            <section key={course.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge>{course.track}</Badge>
                        <Badge className="border-slate-200 bg-slate-50 text-slate-600">{course.level}</Badge>
                      </div>
                      <CardTitle className="mt-4">{course.title}</CardTitle>
                      <CardDescription className="mt-2 max-w-3xl leading-6">
                        {course.description}
                      </CardDescription>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-4 text-sm">
                      <p className="font-semibold text-slate-950">{completion}% complete</p>
                      <p className="mt-1 text-slate-500">
                        {completedLessons} of {totalLessons} lessons
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                {course.modules.map((module) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>{module.title}</CardTitle>
                          <CardDescription className="mt-2 leading-6">
                            {module.description}
                          </CardDescription>
                        </div>
                        <div className="flex shrink-0 items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500">
                          <Clock3 className="size-3.5" />
                          {module.estimatedMinutes}m
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {module.lessons.map((lesson) => {
                          const isComplete = completedKeys.has(`demo:lesson:${lesson.slug}`);

                          return (
                            <div key={lesson.id} className="rounded-lg border border-slate-200 p-3">
                              <div className="flex items-start gap-3">
                                {isComplete ? (
                                  <CheckCircle2 className="mt-0.5 size-4 text-emerald-600" />
                                ) : (
                                  <BookOpenCheck className="mt-0.5 size-4 text-blue-700" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-950">{lesson.title}</p>
                                  <p className="mt-1 text-sm leading-6 text-slate-600">{lesson.summary}</p>
                                  <p className="mt-2 text-xs text-slate-500">
                                    Why it matters: {lesson.businessNote}
                                  </p>
                                </div>
                              </div>
                              {lesson.interactiveRoute ? (
                                <Button asChild variant="outline" size="sm" className="mt-3">
                                  <Link href={lesson.interactiveRoute}>Open interactive lesson</Link>
                                </Button>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>

                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
                          Practice and assessment
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge>{module.practiceTasks.length} tasks</Badge>
                          <Badge>{module.quizQuestions.length} quiz questions</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
