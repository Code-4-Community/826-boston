// Helpers shared by the task panel and task list specs

/** What a refused request looks like to the app: an axios error carrying the message the backend sent. */
export const serverError = (message: string | string[]) =>
  Object.assign(new Error('Request failed with status code 400'), {
    isAxiosError: true,
    response: { data: { message } },
  });

/** A request the test settles itself, to hold a save "in flight". */
export function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
