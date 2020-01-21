import { Annotation, Label, Pagination, Task } from '@/models/connect';
import React, { Dispatch, SetStateAction, useContext } from 'react';

// Not correct yet
export interface AnnotatationContextValue {
  isDisabled: boolean;
  isProjectAdmin: boolean;
  isApprover: boolean;
  isNotApprover: boolean;
  annoList: Annotation[];
  annotations: Annotation[];
  taskList: Task[];
  labelList: Label[];
  task?: Task;
  annotationValue?: number;
  setAnnotationValue: Dispatch<SetStateAction<number | null>>;
  pagination: Pagination;
  sidebarTotal: number;
  sidebarPage: number;
  remaining: number;
  collapsed: boolean;
  // function
  handleRemoveLabel: (annotationId: number) => Promise<void>;
  handleAddLabel: (data: any) => Promise<void>;
  handleEditLabel: (annotationId: any, data: any) => Promise<void>;
}

const createAnnotationCtx = <A extends {}>() => {
  const ctx = React.createContext<A | undefined>(undefined);

  const useCtx = () => {
    const c = useContext(ctx);
    if (!c) throw new Error('useCtx must be inside a Provider with a value');
    return c;
  };

  // make TypeScript infer a tuple, not an array of union types
  return [useCtx, ctx.Provider] as const;
};

export const [useAnnotaionContext, AnnotatationProvider] = createAnnotationCtx<
  AnnotatationContextValue
>();
