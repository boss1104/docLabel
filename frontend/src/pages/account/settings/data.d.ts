export interface TagType {
  key: string;
  label: string;
}

export interface GeographicItemType {
  name: string;
  id: string;
}

export interface NoticeType {
  id: string;
  title: string;
  logo: string;
  description: string;
  updatedAt: string;
  member: string;
  href: string;
  memberLink: string;
}

export interface CurrentUser {
  id: number;
  email: string;
  full_name: string;
  avatar: string;
  username: string;
  //
  notice: NoticeType[];
  tags: TagType[];
  notifyCount: number;
  unreadCount: number;
}
