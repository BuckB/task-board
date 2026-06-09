import { Status } from "@domains/status/model/status.model";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
}
