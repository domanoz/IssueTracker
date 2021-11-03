import { DeleteResult, getRepository } from "typeorm"
import { Issue, IssueState } from "../entities/Issue"

export interface UpdateIssue {
  id: number;
  title?: string;
  description?: string;
  state?: IssueState
}

export abstract class IssueHandler {

  public static async getIssues(): Promise<Issue[]> {
    return await getRepository(Issue).find();
  }

  public static async getIssueById(id: number): Promise<Issue | undefined> {
    return await getRepository(Issue).findOne({id});
  }

  public static async createIssue(issue: Issue): Promise<Issue | undefined> {
    return await getRepository(Issue).save(issue);
  }

  public static async updateIssueById(issue: UpdateIssue): Promise<Issue | undefined> {
    return await getRepository(Issue).save(issue);
  }

  public static async deleteIssueById(id: number): Promise<DeleteResult> {
    return await getRepository(Issue).delete(id);
  }
}
