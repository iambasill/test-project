export const UPLOAD_FIELDS = [
  { name: 'frontView', maxCount: 1 },
  { name: 'backView', maxCount: 1 },
  { name: 'leftView', maxCount: 1 },
  { name: 'rightView', maxCount: 1 }
];

export const INSPECTION_FIELDS = [
  { name: 'frontView', maxCount: 1 },
  { name: 'backView', maxCount: 1 },
  { name: 'leftView', maxCount: 1 },
  { name: 'rightView', maxCount: 1 }
];

export const OPERATOR_FIELDS = [
  {name: "operatorPassport", maxCount: 1},
  {name: "operatorID", maxCount: 1}
]

// upload.fields([
//   { name: 'documents', maxCount: 5 },
//   { name: 'images', maxCount: 3 }
// ]);