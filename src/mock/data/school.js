import Mock from 'mockjs';

const Schools = [
    {
        schoolname: '湖南省小学',
        status: '已审核',
        sharerange: '1',
        audituser: 'admin',
        audittype: '1',
        rescount: '136',
        create_time: Mock.Random.date()
    },
    {
        schoolname: '湖南师范大学',
        status: '已驳回',
        sharerange: '1',
        audituser: 'admin',
        audittype: '1',
        rescount: '231',
        create_time: Mock.Random.date()
    },
    {
        schoolname: '湖南师范大学',
        status: '已审核',
        sharerange: '1',
        audituser: 'admin',
        audittype: '1',
        rescount: '122',
        create_time: Mock.Random.date()
    },
    {
        schoolname: '湖南省小学',
        status: '已审核',
        sharerange: '1',
        audituser: 'admin',
        audittype: '1',
        rescount: '65',
        create_time: Mock.Random.date()
    },
    {
        schoolname: '湖南师范大学',
        status: '已审核',
        sharerange: '1',
        audituser: 'admin',
        audittype: '1',
        rescount: '153',
        create_time: Mock.Random.date()
    }
];

export { Schools };