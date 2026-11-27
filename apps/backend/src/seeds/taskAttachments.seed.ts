export interface TaskAttachmentSeedItem {
  taskId: number;
  fileName: string;
  fileUrl: string;
}

export const TaskAttachmentsSeed: TaskAttachmentSeedItem[] = [
  {
    taskId: 1,
    fileName: 'First_Draft.pdf',
    fileUrl: 'tasks/attachments/First_Draft.pdf',
  },
  {
    taskId: 2,
    fileName: 'Feedback.pdf',
    fileUrl: 'tasks/attachments/Feedback.pdf',
  },
  {
    taskId: 3,
    fileName: 'Planning_Discussion.pdf',
    fileUrl: 'tasks/attachments/Planning_Discussion.pdf',
  },
  {
    taskId: 3,
    fileName: 'Evaluation_Guidelines.pdf',
    fileUrl: 'tasks/attachments/Evaluation_Guidelines.pdf',
  },
];
