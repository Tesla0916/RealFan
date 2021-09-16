export default {
  'GET /api/user/list': [1, 2, 3],
  'POST /api/user/detail': (req: any, res: any) => {
    const { body } = req;
    if (body.id === 1) {
      const user = {
        name: 'ck',
        age: 18,
      };
      res.end(JSON.stringify(user));
    }
  },
};
