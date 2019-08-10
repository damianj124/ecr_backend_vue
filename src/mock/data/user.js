import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'static/img/ecr-icon.png',
    name: '王咪咪'
  }
];

const Users = [];

for (let i = 0; i < 5000; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }));
}

const Capchas = [
  {
    id: 1,
    url: 'static/img/ecr-yzm.png',
    capcha: 'PFXa',
    key: 'aaaa'
  }, 
  {
    id: 2,
    url: 'static/img/hawk.png',
    capcha: 'hawk',
    key: 'bbbb'
  }
];

const Roles = [];
for (let i = 0; i < 86; i++) {
  Roles.push(Mock.mock({
    id: Mock.Random.guid(),
    index: 3206,
    name: '学生',
    create_time: Mock.Random.date(),
    creater: 'Admin'
  }));
}

const Accounts = [];
for (let i = 0; i < 86; i++) {
  Accounts.push(Mock.mock({
    status: '正常',
    fixStatus: '已锁定',
    autoTime: Mock.Random.date(),
    userAccount: 'Username',
    name: '吉星测试员',
    role: '教师',
    sex: '男',
    number: '450881199412087728',
    phone_num: '13600112255',
    mail: '123456@qq.com',
    member: '网校通',
    create_time: Mock.Random.date(),
    last_time: Mock.Random.date()
  }));
}


export { LoginUsers, Users, Capchas, Roles, Accounts };
