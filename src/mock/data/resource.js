import Mock from 'mockjs';

const Resources = [];
for (let i = 0; i < 16; i++) {
  Resources.push(Mock.mock({
    order: '小学',
    grade: '一年级',
    term: '册',
    subject: '语文',
    classification: '课件',
    type: '课件',
    status: '已审核',
    scope: '本省',
    create_time: Mock.Random.date(),
    last_time: Mock.Random.date(),
  }));
};

export { Resources };