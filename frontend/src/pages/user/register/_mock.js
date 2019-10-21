export default {
  'POST  /api/register': (_, res) => {
    res.send({
      status: 'success',
      currentAuthority: 'user',
    });
  },
};
