import request from '@/utils/request';
/**
 * Project query
 */
export async function queryProjectsList() {
  return request('/api/manual/queryProjectsList', {
    method: 'POST',
  });
}

export async function exportProject() {
  return request('/api/manual/exportProject', {
    method: 'POST',
  });
}

export async function querySentencesList(projectId) {
  return request('/api/manual/querySentencesList', {
    method: 'POST',
    data: { projectId },
  });
}

export async function queryLabelsList(projectId) {
  return request('/api/manual/queryLabelsList', {
    method: 'POST',
    data: { projectId },
  });
}

export async function updateLabel({ labelId, text, color, bordercolor }) {
  return request('/api/manual/updateLabel', {
    method: 'POST',
    data: { labelId, text, color, bordercolor },
  });
}

export async function addLabel({ projectId, label: { text, color, bordercolor } = {} }) {
  return request('/api/manual/addLabel', {
    method: 'POST',
    data: {
      projectId,
      label: { text, color, bordercolor },
    },
  });
}

export async function deleteLabel(labelId) {
  return request('/api/manual/deleteLabel', {
    method: 'POST',
    data: { labelId },
  });
}

export async function queryConnectionsList(projectId) {
  return request('/api/manual/queryConnectionsList', {
    method: 'POST',
    data: { projectId },
  });
}

export async function deleteConnection(connectionId) {
  return request('/api/manual/deleteConnection', {
    method: 'POST',
    data: { connectionId },
  });
}

export async function updateConnection({ connectionId, text }) {
  return request('/api/manual/updateConnection', {
    method: 'POST',
    data: { connectionId, text },
  });
}

export async function addConnection({ projectId, connection: { text } = {} }) {
  return request('/api/manual/addConnection', {
    method: 'POST',
    data: {
      projectId,
      connection: { text },
    },
  });
}

export async function saveAnnotation({ projectId, sentenceId, labels = [], connections = [] }) {
  return request('/api/manual/saveAnnotation', {
    method: 'POST',
    data: {
      projectId,
      sentenceId,
      labels,
      connections,
    },
  });
}

export async function queryAnnotation({ projectId, sentenceId }) {
  return request('/api/manual/queryAnnotation', {
    method: 'POST',
    data: { projectId, sentenceId },
  });
}
