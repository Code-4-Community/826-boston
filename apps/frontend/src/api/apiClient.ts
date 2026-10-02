import axios, { type AxiosInstance } from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import {
  Anthology,
  Author,
  CreateAnthologyDto,
  CreateBatchOmchaiAssignmentsDto,
  EditRound,
  OmchaiEntry,
  ProductionInfo,
  Story,
  StoryDraft,
  SubmissionRound,
} from '../types';
import User from './dtos/user.dto';
import Role from './dtos/role';

/** Allows explicitly clearing a field by sending `null` instead of omitting it. */
type Nullable<T> = { [K in keyof T]?: T[K] | null };

export interface FilterSortAnthologyBody {
  pubDateRange?: { start: string; end: string };
  pubLevels?: string[];
  programs?: string[];
  genres?: string[];
  sortBy?: string;
}

const defaultBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

/** Backend returns camelCase (`photoUrl`, `shopifyUrl`); UI expects the snake_case
 *  variants in several places, so both keys are populated on the returned object. */
function normalizeAnthology(raw: unknown): Anthology {
  if (!raw || typeof raw !== 'object') {
    return raw as Anthology;
  }
  const o = raw as Record<string, unknown>;
  const photoUrl =
    (typeof o.photo_url === 'string' ? o.photo_url : undefined) ??
    (typeof o.photoUrl === 'string' ? o.photoUrl : undefined);
  const shopifyUrl =
    (typeof o.shopify_url === 'string' ? o.shopify_url : undefined) ??
    (typeof o.shopifyUrl === 'string' ? o.shopifyUrl : undefined);
  return {
    ...(o as unknown as Anthology),
    photo_url: photoUrl,
    photoUrl: photoUrl,
    shopify_url: shopifyUrl,
    shopifyUrl: shopifyUrl,
  };
}

function normalizeAnthologies(raw: unknown): Anthology[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeAnthology);
}

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
    const data = await this.get('/api/anthologies');
    return normalizeAnthologies(data);
  }

  public async getAnthology(id: string | number): Promise<Anthology> {
    const data = await this.get(`/api/anthologies/${id}`);
    return normalizeAnthology(data);
  }

  public async getStoriesByAnthology(
    anthologyId: string | number,
  ): Promise<Story[]> {
    return this.get(`/api/stories/anthology/${anthologyId}`) as Promise<
      Story[]
    >;
  }

  public async filterSortAnthologies(
    body: FilterSortAnthologyBody,
  ): Promise<Anthology[]> {
    const data = await this.post('/api/anthologies/filter-sort', body);
    return normalizeAnthologies(data);
  }

  public async getAuthors(): Promise<Author[]> {
    return this.get('/api/author') as Promise<Author[]>;
  }

  public async createAuthor(body: {
    name: string;
    nameInBook?: string;
    classPeriod?: string;
  }): Promise<Author> {
    return this.post('/api/author', body) as Promise<Author>;
  }

  public async getProductionInfo(
    anthologyId: number,
  ): Promise<ProductionInfo | null> {
    try {
      return (await this.get(
        `/api/production-info/${anthologyId}`,
      )) as ProductionInfo;
    } catch {
      return null;
    }
  }

  public async createProductionInfo(
    body: Nullable<Omit<ProductionInfo, 'id'>> & { anthology_id: number },
  ): Promise<ProductionInfo> {
    return this.post('/api/production-info', body) as Promise<ProductionInfo>;
  }

  public async updateProductionInfo(
    id: number,
    body: Nullable<Omit<ProductionInfo, 'id'>>,
  ): Promise<ProductionInfo> {
    return this.put(
      `/api/production-info/${id}`,
      body,
    ) as Promise<ProductionInfo>;
  }

  public async updateAnthology(
    id: number,
    body: Nullable<{ shopify_url: string; isbn: string }>,
  ): Promise<Anthology> {
    const data = await this.patch(`/api/anthologies/${id}`, body);
    return normalizeAnthology(data);
  }

  public async getStoryDrafts(anthologyId: number) {
    return this.get(
      `/api/stories/anthology/${anthologyId}/story-drafts`,
    ) as Promise<StoryDraft[]>;
  }

  public async createStoryDraft(body: {
    authorId: number;
    anthologyId: number;
    docLink: string;
  }): Promise<{ message: string }> {
    // NOTE: create story before story draft because story draft
    // only keeps track of progress and story is main entity
    const story = (await this.post(
      `/api/stories/anthology/${body.anthologyId}`,
      {
        title: 'Untitled Story',
        anthologyId: body.anthologyId,
        authorId: body.authorId,
        description: '',
      },
    )) as Story;

    return this.post('/api/story-drafts', {
      ...body,
      storyId: story.id,
    }) as Promise<{
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
    return this.put(`/api/author/${authorId}`, body) as Promise<Author>;
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
    return this.patch(`/api/story-drafts/${storyDraftId}`, body) as Promise<{
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

  public async uploadAnthologyCoverImage(
    anthologyId: number,
    file: File,
  ): Promise<Anthology> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = await this.getAuthHeaders();
    return this.axiosInstance
      .patch(`/api/anthologies/${anthologyId}/cover-image`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => normalizeAnthology(response.data));
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

  public async createAnthology(body: CreateAnthologyDto): Promise<Anthology> {
    return this.post('/api/anthologies', body) as Promise<Anthology>;
  }

  public async createBatchOmchaiAssignments(
    body: CreateBatchOmchaiAssignmentsDto,
  ): Promise<OmchaiEntry[]> {
    return this.post('/api/omchai/batch-assignments', body) as Promise<
      OmchaiEntry[]
    >;
  }
}

export default new ApiClient();
