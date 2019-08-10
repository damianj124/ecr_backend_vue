import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Orders } from './data/order';
import { Grades } from './data/grade';
import { Subjects } from './data/subject';
import { Schools } from './data/school';
import { ChargeStatByArea } from './data/charge';

let _Orders = Orders;
let _Grades = Grades;
let _Subjects = Subjects;
let _Schools = Schools;
let _ChargeStatByArea = ChargeStatByArea;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });
    
    mock.onGet('/order/list').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            orders: _Orders
          }]);
        }, 100);
      });
    });

    mock.onGet('/grade/list').reply(config => {
      let {order} = config.params;
      let mockGrades = _Grades[order];
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            grades: mockGrades
          }]);
        }, 100);
      });
    });

    mock.onGet('/subject/list').reply(config => {
      let {order} = config.params;
      let mockSubjects = _Subjects[order];
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            subjects: mockSubjects
          }]);
        }, 100);
      });
    });

    mock.onGet('/school/list').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            schools: _Schools
          }]);
        }, 100);
      });
    });

    mock.onPost('/operation/getChargeInfoByArea').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            responseEntity: _ChargeStatByArea
          }]);
        }, 100);
      });
    });

    mock.onGet('/operation/getChargeStatistics').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            responseEntity: {
                today:Math.round(Math.random()*1000),
                lastweek:Math.round(Math.random()*1000),
                lastmonth:Math.round(Math.random()*1000),
                average:Math.round(Math.random()*1000)
            }
          }]);
        }, 100);
      });
    });

    mock.onGet('/operation/getChargeInfoByUser').reply(config => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            responseEntity: [
              { username:'Username 1', integral:180000 },
              { username:'Username 2', integral:146000 },
              { username:'Username 3', integral:123000 },
              { username:'Username 4', integral:111000 },
              { username:'Username 5', integral:100000 },
              { username:'Username 6', integral:80000 },
              { username:'Username 7', integral:70000 },
              { username:'Username 8', integral:40000 }
            ]
          }]);
        }, 100);
      });
    });
  }
};