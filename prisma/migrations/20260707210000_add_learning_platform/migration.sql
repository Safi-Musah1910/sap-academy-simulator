CREATE TABLE "Course" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "track" TEXT NOT NULL,
  "level" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Published',
  "sequence" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrainingModule" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "estimatedMinutes" INTEGER NOT NULL,
  "courseId" TEXT NOT NULL,

  CONSTRAINT "TrainingModule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lesson" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "plainEnglish" TEXT NOT NULL,
  "businessNote" TEXT NOT NULL,
  "interactiveRoute" TEXT,
  "sequence" INTEGER NOT NULL,
  "durationMinutes" INTEGER NOT NULL,
  "moduleId" TEXT NOT NULL,

  CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PracticeTask" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "expectedOutcome" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "moduleId" TEXT NOT NULL,

  CONSTRAINT "PracticeTask_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "QuizQuestion" (
  "id" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,
  "optionsJson" TEXT NOT NULL,
  "correctAnswer" TEXT NOT NULL,
  "explanation" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "moduleId" TEXT NOT NULL,

  CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearnerProgress" (
  "id" TEXT NOT NULL,
  "learnerId" TEXT NOT NULL,
  "progressKey" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'Not Started',
  "score" INTEGER NOT NULL DEFAULT 0,
  "completedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "courseId" TEXT,
  "moduleId" TEXT,
  "lessonId" TEXT,
  "taskId" TEXT,

  CONSTRAINT "LearnerProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
CREATE UNIQUE INDEX "TrainingModule_slug_key" ON "TrainingModule"("slug");
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");
CREATE UNIQUE INDEX "PracticeTask_slug_key" ON "PracticeTask"("slug");
CREATE UNIQUE INDEX "LearnerProgress_progressKey_key" ON "LearnerProgress"("progressKey");

ALTER TABLE "TrainingModule" ADD CONSTRAINT "TrainingModule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "TrainingModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PracticeTask" ADD CONSTRAINT "PracticeTask_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "TrainingModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "TrainingModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearnerProgress" ADD CONSTRAINT "LearnerProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearnerProgress" ADD CONSTRAINT "LearnerProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "TrainingModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearnerProgress" ADD CONSTRAINT "LearnerProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearnerProgress" ADD CONSTRAINT "LearnerProgress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "PracticeTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
