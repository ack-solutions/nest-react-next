export class UploadedFile {
  type: any;
  name: any;
  size?: string;
  uri?: string;

  constructor(input?: any) {
    if (input) {
      Object.assign(this, input);
    }
  }
}



export function toFormData(obj: any, form?: any, namespace?: any) {
  const fd = form || new FormData();
  let formKey;
  for (const property in obj) {
    let value = obj[property];
    if (namespace) {
      if (isNaN(property as any)) {
        formKey = namespace + '[' + property + ']';
      } else {
        if (value && typeof value === 'object' && (value instanceof File || value instanceof UploadedFile)) {
          formKey = namespace;
        } else {
          formKey = namespace + '[' + property + ']';
        }
      }
    } else {
      formKey = property;
    }
    if (value instanceof Date) {
      fd.append(formKey, value.toISOString());
    } else if (value && typeof value === 'object' && !(value instanceof File || value instanceof UploadedFile)) {
      toFormData(value, fd, formKey);
    } else {
      if (value instanceof UploadedFile) {
        value = JSON.parse(JSON.stringify(value))
      }
      fd.append(formKey, value);
    }
  }
  return fd;
}
