import Mock from 'mockjs';

const Regions = [];

for (let i = 0; i < 5000; i++) {
  Regions.push(Mock.mock({
    id: Mock.Random.guid(),
    areaid: i+1,
    areaname: Mock.Random.cname(),
    sortid: '',
    creatorid: 'admin',
    createtime: Mock.Random.date(),
    lastmodifierid: 'admin',
    lastmodifytime: Mock.Random.date()
  }));
}
export { Regions };