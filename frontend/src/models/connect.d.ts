import { AnyAction } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState, UserModelType } from './user';
import { LoginModelState } from './login';

export { GlobalModelState, SettingModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    accountCenter: boolean;
    project: boolean;
    label: boolean;
    task: boolean;
    dashboard: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  login: LoginModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}

// Models
export interface Pagination {
  count: number;
  next: {
    limit: string;
    offset: string;
  };
  previous: {
    limit: string;
    offset: string;
  };
}

export interface Project {
  id: number;
  name: string;
  description: string;
  guideline: string;
  randomize_document_order: boolean;
  collaborative_annotation: boolean;
  annotator_per_example: number;
  public: boolean;
  image: string;
  updated_at: string;
  users: UserModelType[];
  project_type: string;
  current_users_role: {
    is_project_admin: boolean;
    is_annotator: boolean;
    is_annotation_approver: boolean;
    is_guest: boolean;
  };
  project_stat: {
    total: number;
    remaining: number;
    docs_stat: {
      count: number;
    };
  };
  resourcetype: string;
}

export interface Label {
  id: number;
  text: string;
  prefix_key?: string;
  project: number;
  suffix_key: string;
  background_color: string;
  text_color: string;
}

export interface Task {
  id: number;
  text: string;
  annotations: Annotation[];
  meta: string;
  annotation_approver?: number;
  file_url?: string;
}

export interface Annotation {
  id: number;
  prob: number;
  user: number;
  document: number;
  finished: boolean;
  label: number;
}
