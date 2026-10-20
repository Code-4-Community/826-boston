export interface TaskAttachmentSeedItem {
  task_id: number;
  fileName: string;
  fileUrl: string;
}

export const TaskAttachmentsSeed: TaskAttachmentSeedItem[] = [
  {
    task_id: 1,
    fileName: 'First_Draft.pdf',
    fileUrl: 'tasks/attachments/First_Draft.pdf',
  },
  {
    task_id: 2,
    fileName: 'Feedback.pdf',
    fileUrl: 'tasks/attachments/Feedback.pdf',
  },
  {
    task_id: 3,
    fileName: 'Planning_Discussion.pdf',
    fileUrl: 'tasks/attachments/Planning_Discussion.pdf',
  },
  {
    task_id: 3,
    fileName: 'Evaluation_Guidelines.pdf',
    fileUrl: 'tasks/attachments/Evaluation_Guidelines.pdf',
  },
];
