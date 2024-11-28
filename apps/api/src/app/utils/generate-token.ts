export function generateToken() {
    let token = '';
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (let index = 0; index < 32; index++) {
      const char = Math.floor(Math.random() * str?.length + 1);
      token += str.charAt(char)
    }
    return token;
  }