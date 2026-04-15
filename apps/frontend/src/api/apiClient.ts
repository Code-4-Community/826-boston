import axios, { type AxiosInstance } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  Anthology,
  Author,
  EditRound,
  OmchaiEntry,
  Story,
  StoryDraft,
  SubmissionRound,
} from '../types';
import User from './dtos/user.dto';
import Role from './dtos/role';

export interface FilterSortAnthologyBody {
  pubDateRange?: { start: string; end: string };
  pubLevels?: string[];
  programs?: string[];
  genres?: string[];
  sortBy?: string;
}

const defaultBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: defaultBaseUrl });
  }

  public async getMe(): Promise<User> {
    return this.get('/api/auth/me') as Promise<User>;
  }

  public async getUsers(): Promise<User[]> {
    return this.get('/api/users') as Promise<User[]>;
  }

  public async getHello(): Promise<string> {
    return this.get('/api') as Promise<string>;
  }

  public async getAnthologies(): Promise<Anthology[]> {
    return this.get('/api/anthologies') as Promise<Anthology[]>;
  }

  public async getAnthology(id: string | number): Promise<Anthology> {
    return this.get(`/api/anthologies/${id}`) as Promise<Anthology>;
  }

  public async getStoriesByAnthology(
    anthologyId: string | number,
  ): Promise<Story[]> {
    return this.get(`/api/anthologies/${anthologyId}/stories`) as Promise<
      Story[]
    >;
  }

  public async filterSortAnthologies(
    body: FilterSortAnthologyBody,
  ): Promise<Anthology[]> {
    return this.post('/api/anthologies/filter-sort', body) as Promise<
      Anthology[]
    >;
  }

  public async getAuthors(): Promise<Author[]> {
    return this.get('/api/author/author') as Promise<Author[]>;
  }

  public async createAuthor(body: {
    name: string;
    nameInBook?: string;
    classPeriod?: string;
  }): Promise<Author> {
    return this.post('/api/author/author', body) as Promise<Author>;
  }

  public async getStoryDrafts(anthologyId: number) {
    return this.get(`/api/story-drafts/anthology/${anthologyId}`) as Promise<
      StoryDraft[]
    >;
  }

  public async createStoryDraft(body: {
    authorId: number;
    anthologyId: number;
    docLink: string;
  }): Promise<{ message: string }> {
    return this.post('/api/story-drafts', body) as Promise<{
      message: string;
    }>;
  }

  public async updateAuthor(
    authorId: number,
    body: {
      name?: string;
      nameInBook?: string;
      classPeriod?: string;
    },
  ): Promise<Author> {
    return this.put(`/api/author/author/${authorId}`, body) as Promise<Author>;
  }

  public async updateStoryDraft(
    storyDraftId: number,
    body: {
      docLink?: string;
      submissionRound?: SubmissionRound;
      studentConsent?: boolean;
      inManuscript?: boolean;
      editRound?: EditRound;
      proofread?: boolean;
      notes?: string[];
    },
  ): Promise<{ message: string }> {
    return this.post(`/api/story-drafts/${storyDraftId}`, body) as Promise<{
      message: string;
    }>;
  }

  public async getOmchaiByAnthology(
    anthologyId: number,
  ): Promise<OmchaiEntry[]> {
    return this.get(`/api/omchai/anthology/${anthologyId}`) as Promise<
      OmchaiEntry[]
    >;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  }

  private async get(path: string): Promise<unknown> {
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .get(path, { headers })
      .then((response) => response.data);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .post(path, body, { headers })
      .then((response) => response.data);
  }

  private async put(path: string, body: unknown): Promise<unknown> {
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .put(path, body, { headers })
      .then((response) => response.data);
  }

  private async patch(path: string, body: unknown): Promise<unknown> {
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .patch(path, body, { headers })
      .then((response) => response.data);
  }

  private async delete(path: string): Promise<unknown> {
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .delete(path, { headers })
      .then((response) => response.data);
  }

  public async createUser(body: {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    title: string;
  }): Promise<User> {
    console.log(body);
    return this.post('/api/auth/admin/users', body) as Promise<User>;
  }
}

export default new ApiClient();
