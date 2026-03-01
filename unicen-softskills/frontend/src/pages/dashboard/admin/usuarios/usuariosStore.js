const KEY = "epsico_users_v1";

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export function seedIfEmpty() {
  const current = safeParse(localStorage.getItem(KEY), null);
  if (Array.isArray(current) && current.length > 0) return;

  const seed = [
    {
      id: crypto.randomUUID(),
      nombres: "María Fernanda",
      apellidos: "Castellón Pérez",
      email: "mcastellon@unicen.edu",
      rol: "Estudiante",
      estado: "Activo",
      createdAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      nombres: "Juan Carlos",
      apellidos: "Rojas Molina",
      email: "jrojas@unicen.edu",
      rol: "Docente",
      estado: "Activo",
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(seed));
}

export function getUsers() {
  seedIfEmpty();
  return safeParse(localStorage.getItem(KEY), []);
}

export function addUser(user) {
  const users = getUsers();

  const emailLower = String(user.email || "").trim().toLowerCase();
  if (users.some((u) => String(u.email).toLowerCase() === emailLower)) {
    throw new Error("Ya existe un usuario con ese correo.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    ...user,
    email: emailLower,
    createdAt: new Date().toISOString(),
  };

  users.unshift(newUser);
  localStorage.setItem(KEY, JSON.stringify(users));
  return newUser;
}

export function updateUser(id, patch) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) throw new Error("Usuario no encontrado.");

  // Validación de email si se cambia
  if (patch.email) {
    const emailLower = String(patch.email).trim().toLowerCase();
    const conflict = users.some(
      (u) => u.id !== id && String(u.email).toLowerCase() === emailLower
    );
    if (conflict) throw new Error("Ya existe otro usuario con ese correo.");
    patch.email = emailLower;
  }

  users[idx] = { ...users[idx], ...patch };
  localStorage.setItem(KEY, JSON.stringify(users));
  return users[idx];
}

export function deleteUser(id) {
  const users = getUsers();
  const next = users.filter((u) => u.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function findUserById(id) {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}