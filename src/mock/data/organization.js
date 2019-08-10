import Mock from 'mockjs';

const Organizations = [];

for (let i = 0; i < 5000; i++) {
  Organizations.push(Mock.mock({
    id: Mock.Random.guid(),
    org_id: i+1,
    parent_id: 5000 - i,
    name: Mock.Random.cname(),
    logo: '',
    serial_id: '',
    tag: '',
    type: '',
    addr: Mock.mock('@county(true)'),
    creator: 'admin',
    create_time: Mock.Random.date(),
    modifier: 'admin',
    modified_time: Mock.Random.date()
  }));
}

export { Organizations };