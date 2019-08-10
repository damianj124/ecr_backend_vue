import NotFound from './views/404.vue'
import template from './views/template.vue'
import main from './views/main.vue'
import login from './views/login.vue'
import home from './views/home/index.vue'
import upload from './views/resourceupload/upload.vue'
import upload_step1 from './views/resourceupload/step1.vue'
import upload_step2 from './views/resourceupload/step2.vue'
import resourceimport from './views/resourceupload/import.vue'
import resourceimport_detail from './views/resourceupload/detail.vue'
import review from './views/resourcereview/index.vue'
import reviewdetail from './views/resourcereview/detail.vue'
import reviewrecord from './views/reviewrecord/index.vue'
import reviewstat from './views/reviewstat/index.vue'
import raise from './views/resourceraise/index.vue'
import propose from './views/resourceraise/propose.vue'
import raisedetail from './views/resourceraise/detail.vue'
import raisereview from './views/resourceraise/review.vue'
import raisestat from './views/resourceraise/stat.vue'
import compareappr_list from './views/compareappr/index.vue'
import compareappr_propose from './views/compareappr/propose.vue'
import compareappr_detail from './views/compareappr/detail.vue'
import compareappr_stat from './views/compareappr/stat.vue'
import compareappr_review from './views/compareappr/review.vue'
import wagerreview from './views/resourcewager/review.vue'
import label from './views/labelmng/index.vue'
import special from './views/specialmng/index.vue'
import special_add from './views/specialmng/add.vue'
import special_add_res from './views/specialmng/add_res.vue'
import special_edit from './views/specialmng/edit.vue'
import badword from './views/badword/index.vue'
import resource from './views/resourcemng/index.vue'
import resourcedetail from './views/resourcemng/detail.vue'
import resource_preview from './views/resourcemng/preview.vue'
import stuffdetail from './views/stuffmng/detail.vue'
import stuff from './views/stuffmng/index.vue'
// import stuffpkg from './views/stuffpkgmng/index.vue'
import teachingmaterial_add from './views/teachingmaterialmng/add.vue'
import teachingmaterial_list from './views/teachingmaterialmng/index.vue'
import teachingmaterial_edit from './views/teachingmaterialmng/edit.vue'
// import curriculum from './views/curriculummng/index.vue'
import coursenavigation from './views/coursenavigationmng/index.vue'
import stat_graph from './views/resourcestat/index.vue'
import stat_table from './views/resourcestat/table.vue'
import stat_detail from './views/resourcestat/detail.vue'
import pie from './views/resourcestat/pie.vue'
import map from './views/resourcestat/map.vue'
import pie2 from './views/resourcestat/pie2.vue'
import curve from './views/resourcestat/curve.vue'
import chargelog from './views/charge/chargelog.vue'
import chargestat from './views/charge/chargestat.vue'
import userscore from './views/score/userscore.vue'
import scorelog from './views/score/scorelog.vue'
import scoredetail from './views/score/scoredetail.vue'
import scorestat from './views/score/scorestat.vue'
import scorerule from './views/scorerule/index.vue'
import orderlog from './views/order/orderlog.vue'
import orderstat from './views/order/orderstat.vue'
import orderdetail from './views/order/orderdetail.vue'
import errreport from './views/reportmng/errorreport.vue'
import report from './views/reportmng/report.vue'
import synonym from './views/synonym/index.vue'
import wholeteacher from './views/teachermng/whole.vue'
import famousteacher from './views/teachermng/famous.vue'
import wholeschool from './views/schoolmng/whole.vue'
import famousschool from './views/schoolmng/famous.vue'
import sysdic_type from './views/sysdicmng/type.vue'
import sysdic_item from './views/sysdicmng/item.vue'
import advertisement from './views/advertisement/index.vue'
import operation from './views/operationlogmng/index.vue'
import useract from './views/useractmng/index.vue'


let routes = [
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/login',
        component: login,
        name: '',
        hidden: true
    },
    {
        path: '/home',
        component: template,
        name: '',
        leaf: true,
        children: [
            {
                path: '/home',
                component: home,
                name: '首页'
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '资源管理',
        children: [
            {
                path: '/upload/step1',
                component: upload,
                name: '资源上传',
                children: [
                    {
                        path: '/upload/step1',
                        component: upload_step1,
                        name: '资源上传 Step1',
                        hidden: true
                    },
                    {
                        path: '/upload/step2',
                        component: upload_step2,
                        name: '资源上传 Step2',
                        hidden: true
                    },
                    {
                        path: '/upload/step3',
                        component: upload_step2,
                        name: '资源上传 Step3',
                        hidden: true
                    }
                ]
            },
            {
                path: '/import',
                component: resourceimport,
                name: '资源批量导入'
            },
            {
                path: '/import/detail/:id',
                component: resourceimport_detail,
                name: '资源批量导入详情',
                hidden: true
            },
            { 
                path: '/resource', 
                component: resource, 
                name: '资源管理' 
            },
            { 
                path: '/resource/:id', 
                component: resourcedetail, 
                name: '资源详情',
                hidden: true
            },
            {
                path: '/resource/preview/:id',
                component: resource_preview,
                name: '资源Preview',
                hidden: true
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '资源统计',
        children: [
            {
                path: '/statistics/map',
                component: stat_graph,
                name: '统计概况-图形',
                children: [
                    {
                        path: '/statistics/map',
                        component: map,
                        name: '资源统计 Map',
                        hidden: true
                    },
                    { 
                        path: '/statistics/pie',
                        component: pie,
                        name: '资源统计 PIE',
                        hidden: true
                    },
                    { 
                        path: '/statistics/pie2',
                        component: pie2,
                        name: '资源统计 PIE 2',
                        hidden: true
                    },
                    { 
                        path: '/statistics/curve',
                        component: curve,
                        name: '资源统计 拆线图',
                        hidden: true
                    }
                ]
            },
            {
                path: '/statistics/table',
                component: stat_table,
                name: '统计概况-报表'
            },
            {
                path: '/statistics/detail',
                component: stat_detail,
                name: '详情统计'
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '审核管理',
        children: [
            { 
                path: '/review',
                component: review,
                name: '上传资源审核' 
            },
            {
                path: '/review/:id',
                component: reviewdetail,
                name: '资源审核详情',
                hidden: true
            },
            {
                path: '/raisereview',
                component: raisereview,
                name: '征集资源审核'
            },
            {
                path: '/compareappr_stat', 
                component: compareappr_review, 
                name: '评比资源审核'
            },
            {
                path: '/wagerreview',
                component: wagerreview,
                name: '悬赏资源审核'
            },
            {
                path: '/reviewrecord',
                component: reviewrecord,
                name: '审核记录'
            },
            {
                path: '/reviewstat',
                component: reviewstat,
                name: '审核统计'
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '征集评比管理',
        children: [
            {
                path: '/propose',
                component: propose,
                name: '发起资源征集'
            },
            { 
                path: '/raise', 
                component: raise, 
                name: '征集活动管理' 
            },
            { 
                path: '/raise/:id', 
                component: raisedetail, 
                name: '资源征集详情',
                hidden: true
            },
            { 
                path: '/raisestat/:id', 
                component: raisestat, 
                name: '征集活动管理详情',
                hidden: true
            },
            {
                path: '/compareappr/propose',
                component: compareappr_propose,
                name: '发起评比活动'
            },
            { 
                path: '/compareappr', 
                component: compareappr_list, 
                name: '评比活动管理' 
            },
            { 
                path: '/compareappr/:id', 
                component: compareappr_detail, 
                name: '悬赏资源详情',
                hidden: true
            },
            { 
                path: '/compareappr_stat/:id', 
                component: compareappr_stat, 
                name: '评比活动管理详情',
                hidden: true
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '名师名校管理',
        children: [
            {
                path: '/school/whole',
                component: wholeschool,
                name: '学校查询'
            },
            {
                path: '/school/famous',
                component: famousschool,
                name: '名校管理'
            },
            {
                path: '/teacher/whole',
                component: wholeteacher,
                name: '教师查询'
            },
            {
                path: '/teacher/famous',
                component: famousteacher,
                name: '名师管理'
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '系统管理',
        children: [
            {   
                path: '/special',
                component: special,
                name: '专题管理',
                
            },
            {
                path: '/special_add/:id',
                component: special_add,
                name: '专题管理_add',
                hidden: true
            },
            {
                path: '/special_add_res',
                component: special_add_res,
                name: '专题管理_add_res',
                hidden: true
            },
            {
                path: '/special_edit/:id',
                component: special_edit,
                name: '专题管理_edit',
                hidden: true
            },
            {   
                path: '/badword',
                component: badword,
                name: '敏感词管理',
                
            },
            {
                path: '/label',
                component: label,
                name: '标签管理'
            },
            {
                path: '/sysdic/type',
                component: sysdic_type,
                name: '字典类型管理'
            },
            {
                path: '/sysdic/item',
                component: sysdic_item,
                name: '字典项管理'
            },
            {
                path: '/teachingmaterial',
                component: teachingmaterial_list,
                name: '教材教辅管理',
                children: [
                    {
                        path: '/teachingmaterial/add',
                        component: teachingmaterial_add,
                        name: '教材教辅管理 Add',
                        hidden: true
                    },
                    {
                        path: '/teachingmaterial/edit/:id',
                        component: teachingmaterial_edit,
                        name: '教材教辅管理 Edit',
                        hidden: true
                    }
                ]
            },
            // {
            //     path: '/curriculum',
            //     component: curriculum,
            //     name: '课程管理'
            // },
            {
                path: '/coursenavigation',
                component: coursenavigation,
                name: '学科导航管理'
            },
            {
                path: '/adv',
                component: advertisement,
                name: '广告管理'
            },
            {
                path: '/erreport', 
                component: errreport, 
                name: '报错管理' 
            },
            {
                path: '/report', 
                component: report, 
                name: '举报管理' 
            },
            {
                path: '/synonym',
                component: synonym,
                name: '同义词管理'
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '商品管理',
        children: [
            { 
                path: '/stuff', 
                component: stuff, 
                name: '商品管理' 
            },
            {
                path: '/stuff/:id', 
                component: stuffdetail, 
                name: '商品详情',
                hidden: true
            },
            // {
            //     path: '/stuffpkg',
            //     component: stuffpkg,
            //     name: '商品打包管理'
            // }
        ]
    },
    {
        path: '/',
        component: template,
        name: '订单管理',
        children: [
            {
                path: '/order/log',
                component: orderlog,
                name: '订单管理'
            },
            {
                path: '/order/detail/:id',
                component: orderdetail,
                name: '订单详情',
                hidden: true
            },
            {
                path: '/order/statistics',
                component: orderstat,
                name: '订单统计'
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '积分管理',
        children: [
            {
                path: '/scorerule',
                component: scorerule,
                name: '积分规则配置'
            },
            {
                path: '/score/log',
                component: scorelog,
                name: '积分日志管理'
            },
            {
                path: '/score/userscore',
                component: userscore,
                name: '用户积分管理'
            },
            {
                path: '/score/scorestat',
                component: scorestat,
                name: '积分统计'
            },
            {
                path: '/score/scoredetail/:user',
                component: scoredetail,
                name: '',
                hidden: true
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '充值管理',
        children: [
            {
                path: '/charge/log',
                component: chargelog,
                name: '充值日志管理'
            },
            {
                path: '/charge/statistics',
                component: chargestat,
                name: '充值金额量统计'
            }
        ]
    },
    {
        path: '/',
        component: template,
        name: '日志管理',
        children: [
            {
                path: '/operation',
                component: operation,
                name: '操作日志管理'
            },
            {
                path: '/useract',
                component: useract,
                name: '用户行为管理'
            }
        ]
    }
];

export default routes;