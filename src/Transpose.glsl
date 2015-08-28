
mat2 tanspose(mat2 m) {
  mat2 r;
  for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
       r[i][j] = m[j][i];
    }
  }
  return r;
}

mat3 tanspose(mat3 m) {
  mat3 r;
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
       r[i][j] = m[j][i];
    }
  }
  return r;
}

mat4 tanspose(mat4 m) {
  mat4 r;
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
       r[i][j] = m[j][i];
    }
  }
  return r;
}
