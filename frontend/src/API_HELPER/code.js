export const getResult = (code) => {
  return fetch(`/api/codeall`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(code),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const getcodeTosave = (NameAndcode) => {
  return fetch(`/api/savecode`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(NameAndcode),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};

export const getSavedCode = (name) => {
  return fetch(`/api/getSavedCode`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(name),
  })
    .then((response) => {
      return response.json();
    })
    .catch((err) => console.error(err));
};
