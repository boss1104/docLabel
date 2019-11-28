import request from '@/utils/request';

/**
 * Annotation services
 */

export async function queryLabel({ projectId, params }) {
  return request(`/api/projects/${projectId}/labels/`, {
    params,
  });
}

export async function addAnno({ projectId, taskId, data }) {
  return request(`/api/projects/${projectId}/docs/${taskId}/annotations/`, {
    method: 'POST',
    data,
  });
}

export async function removeAnno({ projectId, taskId, annotationId }) {
  return request(`/api/projects/${projectId}/docs/${taskId}/annotations/${annotationId}/`, {
    method: 'DELETE',
  });
}

export async function editAnno({ projectId, taskId, annotationId, data }) {
  return request(`/api/projects/${projectId}/docs/${taskId}/annotations/${annotationId}/`, {
    method: 'PATCH',
    data,
  });
}

export async function markCompleted({ projectId }) {
  return request(`/api/projects/${projectId}/annotations/completed/`, {
    method: 'PATCH',
  });
}
