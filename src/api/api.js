import axios from 'axios';
import util from '../common/js/util'

var openapi_server = axios.create({
        baseURL: OPENAPI_SERVER,
        headers: {
            'Content-Type':'application/json'
        }
    });
const getConfig = params => { return { headers: { 'token':localStorage.getItem('backend-token') } }; };
const getMultipartConfig = params => { return { headers: { 'Content-Type':'multipart/form-data;charset=UTF-8', 'token':localStorage.getItem('backend-token') } }; };

export const requestLogin = params => { return util.checkToken(openapi_server.post(`/user/loginUser`, params)); };
export const requestCapcha = params => { return util.checkToken(openapi_server.get(`/user/requestCaptcha`)); };

export const uploadResourceBatch = params => { return util.checkToken(openapi_server.post(`/file/uploadFile`, params, getConfig())); };
export const getResource = contentId => {return util.checkToken(openapi_server.get(`/resource/detailResource/` + contentId, getConfig())); };
export const getDataListPage = params => { return util.checkToken(openapi_server.post(`/resource/getImportedList`, params, getConfig())); };
export const downloadTemplate = params => { return util.checkToken(openapi_server.get(`/resource/downResourceTemplate`, getConfig())); };
export const batchRemoveResources = params => { return util.checkToken(openapi_server.post(`/resource/deleteBatchResources`, params, getConfig())); };
export const uploadResInfoApi = params => { return util.checkToken(openapi_server.post(`/resource/batchStateUpdate`, params, getConfig())); };
export const detailResource = contentId => { return util.checkToken(openapi_server.get(`/resource/detailResource/` + contentId, getConfig())); };
export const editResource = params => { return util.checkToken(openapi_server.post(`/resource/editResource`,  params, getConfig())); };
export const uploadResource = params => { return util.checkToken(openapi_server.post(`/resource/uploadResource`, params, getConfig())); };
export const uploadFileInfo = params => { return util.checkToken(openapi_server.post(`/resource/uploadFileInfo`, params, getConfig())); };
export const getResourceList = params => { return util.checkToken(openapi_server.post(`/resource/getResourceList` , params, getConfig())); };
export const getUploadResourceList = params => { return util.checkToken(openapi_server.post(`/resource/getUploadResourceList` , params, getConfig())); };
export const getCollectedResourceList = params => { return util.checkToken(openapi_server.post(`/resource/getCollectedResourceList`, params, getConfig())); };
export const downloadResource = resourceId => { return util.checkToken(openapi_server.get(`/resource/downloadResource/` + resourceId, getConfig())); };
export const setResourceLabel = params => { return util.checkToken(openapi_server.post(`/resource/setResourceLabel`, params, getConfig())); };
export const addBatchGoods = params => { return util.checkToken(openapi_server.post(`/resource/addBatchGoods`, params, getConfig())); };
export const getGoodsStatistics = params => {return util.checkToken(openapi_server.get(`/resource/getResourceStatistics`, getConfig())); };
export const getGoodsStatus = kind => {return util.checkToken(openapi_server.get(`/resource/getResourceStatus/` + kind, getConfig())); };
export const getTopTenUsers = params => {return util.checkToken(openapi_server.get(`/resource/getTopTenUsers`, getConfig())); };
export const getGoodsCount = params => {return util.checkToken(openapi_server.post(`/resource/getGoodsCount`, params, getConfig())); };
export const getGoodsCountByArea = params => {return util.checkToken(openapi_server.post(`/resource/getResourceCountByArea`, params, getConfig())); };
export const exportChartData = mode => {return util.checkToken(openapi_server.get(`/resource/exportToExcel/` + mode, getConfig())); };
export const exportActivityDetail = params => { return util.checkToken(openapi_server.post(`/resource/exportActivityDetail`, params, getConfig())); };

export const allowResource = params => { return util.checkToken(openapi_server.post(`/audit/allowResource`, params, getConfig())); };
export const denyResource = params => { return util.checkToken(openapi_server.post(`/audit/denyResource`, params, getConfig())); };
export const getAuditList = params => { return util.checkToken(openapi_server.post(`audit/getAuditList`, params, getConfig())); };
export const getAuditUserList = params => { return util.checkToken(openapi_server.get(`/audit/getAuditUserList`, getConfig())); };
export const exportToExcel = params => { return util.checkToken(openapi_server.post(`/audit/exportToExcel`, params, getConfig())); };
export const getAuditStatistics = params => { return util.checkToken(openapi_server.post(`/audit/getAuditStatistics`, params, getConfig())); };

// <!-- Author : GOD 2019-2-18 Bug ID: #781 -->
export const getAuditStatisticsDetail = params => { return util.checkToken(openapi_server.post(`/audit/getAuditStatisticsDetail`, params, getConfig())); };
// <!-- Author : GOD 2019-2-18 Bug ID: #781 -->

export const getOneLabelList = params => { return util.checkToken(openapi_server.post(`/label/getOneLabelList` , params, getConfig())); };
export const getTwoLabelList = params => { return util.checkToken(openapi_server.post(`/label/getTwoLabelList` , params, getConfig())); };
export const getThreeLabelList = params => { return util.checkToken(openapi_server.post(`/label/getThreeLabelList` , params, getConfig())); };
export const addLabel = params => { return util.checkToken(openapi_server.post(`/label/addLabel`, params, getConfig())); };
export const editLabel = params => { return util.checkToken(openapi_server.post(`/label/editLabel`, params, getConfig())); };
export const deleteLabel = labelId => { return util.checkToken(openapi_server.get(`/label/deleteLabel/` + labelId, getConfig())); };
export const getLabelList = params => { return util.checkToken(openapi_server.post(`/label/getLabelList`, params, getConfig())); };
export const getLabelTree = params => { return util.checkToken(openapi_server.post(`/label/getLabelTree`, params, getConfig())); };
export const moveLabel = params => { return util.checkToken(openapi_server.post(`/label/moveLabel`, params, getConfig())); };
export const insertTheme = params => { return util.checkToken(openapi_server.post(`/theme/insertTheme`, params, getConfig()));};
export const getThemeList = params => { return util.checkToken(openapi_server.post(`/theme/getThemeList`, params, getConfig()));};
// Author : GOD, 2019-2-26 Bug ID: #911
export const getThemeDetail = themeId => { return util.checkToken(openapi_server.get(`/theme/getThemeById/` + themeId, getConfig()));};
export const modifyTheme = params => { return util.checkToken(openapi_server.post(`/theme/modifyTheme`, params, getConfig())); }
// Author : GOD, 2019-2-26 Bug ID: #911
export const getThemeResourceList = params => { return util.checkToken(openapi_server.post(`/theme/getResourceList`, params, getConfig()));};
export const removeTheme = params => { return util.checkToken(openapi_server.get(`/theme/removeTheme/` + params, getConfig()));};
export const removeThemeRes = params => { return util.checkToken(openapi_server.post(`/themeres/removeThemeRes`, params, getConfig()));};
export const insertThemeRes = params => { return util.checkToken(openapi_server.post(`/themeres/insertThemeRes`, params, getConfig()));};
export const exportThemeToExcel = params => { return util.checkToken(openapi_server.post(`/themeres/exportToExcel`, params, getConfig()));};
export const importFromExcel = params => { return util.checkToken(openapi_server.post(`/themeres/importFromExcel`, params, getConfig()));};

export const getGoodsList = params => { return util.checkToken(openapi_server.post(`/good/getGoodsList`, params, getConfig())); };
export const getGoodsListByStatus = params => { return util.checkToken(openapi_server.post(`/good/getGoodsListByStatus`, params, getConfig())); };

export const modifyPriceToGoodsList = params => { return util.checkToken(openapi_server.post(`/good/modifyScoreToGoodsList`, params, getConfig())); };
export const modifySellStatusToGoodsList = params => { return util.checkToken(openapi_server.post(`/good/modifySellStatusToGoodsList`, params, getConfig())); };
export const getCatalogHeader = params => { return util.checkToken(openapi_server.post(`/catalog/getCatalogHeader` , params, getConfig())); };
export const getCatalogList = params => { return util.checkToken(openapi_server.post(`/catalog/getCatalogList` , params, getConfig())); };
export const exportCatalogExcel = params => { return util.checkToken(openapi_server.post(`/catalog/exportToExcel`, params, getConfig()));};
export const getStatusBySchool = params => { return util.checkToken(openapi_server.post(`/school/getGoodStatus`, params, getConfig())); };
export const exportToExcelSchool = params => { return util.checkToken(openapi_server.post(`/school/exportToExcel`, params, getConfig())); };

export const getSchoolSectionList = params => { return util.checkToken(openapi_server.post(`/navigation/getSchoolSectionList`, params, getConfig())); };
export const getSubjectList = params => { return util.checkToken(openapi_server.post(`/navigation/getSubjectList`, params, getConfig())); };
export const getBookModelList = params => { return util.checkToken(openapi_server.post(`/navigation/getBookModelList`, params, getConfig())); };
export const getEditionTypeList = params => { return util.checkToken(openapi_server.post(`/navigation/getEditionTypeList`, params, getConfig())); };
export const getNaviSchoolSectionList = params => { return util.checkToken(openapi_server.post(`/navigation/getNaviSchoolSectionList`, params, getConfig())); };
export const getNaviSubjectList = params => { return util.checkToken(openapi_server.post(`/navigation/getNaviSubjectList`, params, getConfig())); };
export const getNaviGradeList = params => { return util.checkToken(openapi_server.post(`/navigation/getNaviGradeList`, params, getConfig())); };
export const getNaviBookModelList = params => { return util.checkToken(openapi_server.post(`/navigation/getNaviBookModelList`, params, getConfig())); };
export const getNaviEditionTypeList = params => { return util.checkToken(openapi_server.post(`/navigation/getNaviEditionTypeList`, params, getConfig())); };
export const addCoursenNavigation = params => { return util.checkToken(openapi_server.post(`/navigation/addNavigation`, params, getConfig())); };
export const editCoursenNavigation = params => { return util.checkToken(openapi_server.post(`/navigation/modifyNavigation`, params, getConfig())); };
export const deleteCoursenNavigation = params => { return util.checkToken(openapi_server.post(`/navigation/removeNavigation/`, params, getConfig())); };
export const getCoursenNavigationList = params => { return util.checkToken(openapi_server.post(`/navigation/getNavigationList`, params, getConfig())); };
export const changeStateNg = params => { return util.checkToken(openapi_server.post(`/navigation/changeNaviStatus`, params, getConfig())); };
export const getNavigationTree = params => { return util.checkToken(openapi_server.get(`/navigation/getNavigationTree`, getConfig())); };

export const getBookInfoList = params => { return util.checkToken(openapi_server.post(`/book/getBookInfoList`, params, getConfig())); };
export const setBook = params => { return util.checkToken(openapi_server.post(`/book/setBook`, params, getMultipartConfig())); };
export const updateBookWithoutCatalog = params => { return util.checkToken(openapi_server.post('/book/update_book_without_catalog', params, getMultipartConfig())); };
export const deleteBook = bookId => { return util.checkToken(openapi_server.get(`/book/deleteBook/` + bookId, getConfig())); };
export const getBookInfo = bookId => { return util.checkToken(openapi_server.get(`/book/getBookInfo/` + bookId, getConfig())); };
export const getGoodsStatisticsByBookid = bookId => { return util.checkToken(openapi_server.get(`/book/getGoodsStatisticsByBookid/` + bookId, getConfig())); };
export const exportToExcelInStatistics = bookId => {return util.checkToken(openapi_server.get(`/book/exportToExcel/` + bookId, getConfig())); };

export const insertCatalog = params => { return util.checkToken(openapi_server.post(`/catalog/insertCatalog`, params, getConfig())); };
export const deleteCatalog = catalogId => {return util.checkToken(openapi_server.get(`/catalog/deleteCatalog/` + catalogId, getConfig())); };
export const moveCatalog = params => {return util.checkToken(openapi_server.post(`/catalog/moveCatalog`, params, getConfig())); };
export const getTeachCatalogList = params => { return util.checkToken(openapi_server.post(`/catalog/getCatalogTree` , params, getConfig())); };

export const addCollectionActivity = params => { return util.checkToken(openapi_server.post(`/collection/addCollectionActivity`, params, getConfig())); };
export const editCollectionActivity = params => { return util.checkToken(openapi_server.post(`/collection/editCollectionActivity`, params, getConfig())); };
export const getCollectionActivityList = params => { return util.checkToken(openapi_server.post(`/collection/getCollectionActivityList`, params, getConfig())); };
export const deleteActivity = params => { return util.checkToken(openapi_server.get(`/collection/delete/` + params, getConfig())); };
export const endCollectionActivity = params => { return util.checkToken(openapi_server.get(`/collection/endCollectionActivity/` + params, getConfig())); };
export const batchRemoveActivity = params => { return util.checkToken(openapi_server.post(`/collection/batchRemoveActivity`, params, getConfig())); };
export const getActivity = params => { return util.checkToken(openapi_server.get(`/collection/` + params, getConfig())); };
export const getActivityDetailList = params => { return util.checkToken(openapi_server.post(`/resource/getActivityDetailList`, params, getConfig())); };
export const getCollectionCountInfo = params => { return util.checkToken(openapi_server.get(`/collection/getCollectionCountInfo/` + params, getConfig())); };

export const addEstimateActivity = params => { return util.checkToken(openapi_server.post(`/estimate/addEstimateActivity`, params, getConfig())); };
export const getEstimateActivityList = params => { return util.checkToken(openapi_server.post(`/estimate/getEstimateActivityList`, params, getConfig())); };
export const endEstimateActivity = params => { return util.checkToken(openapi_server.get(`/estimate/endEstimateActivity/` + params, getConfig())); };
export const batchRemoveEstimateActivity = params => { return util.checkToken(openapi_server.post(`/estimate/batchRemoveActivity`, params, getConfig())); };
export const getEstimateActivity = params => { return util.checkToken(openapi_server.get(`/estimate/` + params, getConfig())); };
export const editEstimateActivity = params => { return util.checkToken(openapi_server.post(`/estimate/editEstimateActivity`, params, getConfig())); };
export const getEstimateTeacherList = params => { return util.checkToken(openapi_server.post(`/estimate/getEstimateTeacherList`, params, getConfig())); };
export const exportTeacherDetail = params => { return util.checkToken(openapi_server.post(`/estimate/exportTeacherDetail`, params, getConfig())); };
export const getEstimateResourceList = params => { return util.checkToken(openapi_server.post(`/resource/getEstimateResourceList`, params, getConfig())); };

export const getChargeInfoByUser = params => {return util.checkToken(openapi_server.get(`/charge/getTopTenUsers`, getConfig())); };
export const getChargeStatistics = params => {return util.checkToken(openapi_server.get(`/charge/getChargeStatistics`, getConfig())); };
export const getChargeInfoByArea = params => {return util.checkToken(openapi_server.post(`/charge/getChargeByArea`, params, getConfig())); };
export const exportChargeStatToExcel = params => {return util.checkToken(openapi_server.get(`/charge/exportToExcel`, getConfig())); };
export const getChargeItemList = params => { return util.checkToken(openapi_server.post(`/charge/getChargeItemList` , params, getConfig())); };

export const getOrderInfoByUser = params => {return util.checkToken(openapi_server.get(`/order/getTopTenUsers`, getConfig())); };
export const getOrderStatistics = params => {return util.checkToken(openapi_server.get(`/order/getOrderStatistics`, getConfig())); };
export const getOrderInfoByArea = params => {return util.checkToken(openapi_server.get(`/order/getOrderByArea`, getConfig())); };
export const exportOrderStatToExcel = params => {return util.checkToken(openapi_server.get(`/order/export2Excel`, getConfig())); };
export const getOrderItemList = params => { return util.checkToken(openapi_server.post(`/order/getOrderList` , params, getConfig())); };
export const getGoodsListByOrder = params => { return util.checkToken(openapi_server.post(`/order/getGoodsListByOrder`, params, getConfig())); };

export const getAccountScoreList = params => { return util.checkToken(openapi_server.post(`/score/getAccountScoreList` , params, getConfig())); };
export const getAccountScoreLog = params => { return util.checkToken(openapi_server.post(`/score/getAccountScoreLog` , params, getConfig())); };
export const setAccountScoreRule = params => { return util.checkToken(openapi_server.post(`/score/setAccountScoreRule` , params, getConfig())); };
export const getScoreByUserId = params => { return util.checkToken(openapi_server.get(`/score/getUserScore/` + params, getConfig())); };
export const getScoreDetailByUserId = params => { return util.checkToken(openapi_server.post(`/score/getScoreDetailByUserId`, params, getConfig())); };
export const getScoreStatistic = params => { return util.checkToken(openapi_server.get(`/score/getScoreStatistic/`, getConfig())); };
export const getTop10ScoreUser = params => { return util.checkToken(openapi_server.get(`/score/getTop10ScoreUser/`, getConfig())); };
export const getScoreTotalIntegralInfo = params => { return util.checkToken(openapi_server.get(`/score/getScoreTotalIntegralInfo/`, getConfig())); };

export const batchRegisterSchoolList = params => { return util.checkToken(openapi_server.post(`/school/batchRegisterSchoolList` , params, getConfig())); };
export const getSchoolList = params => { return util.checkToken(openapi_server.post(`/school/getSchoolList` , params, getConfig())); };
export const batchSetSchoolNamed = params => { return util.checkToken(openapi_server.post(`/school/batchSetSchoolNamed` , params, getConfig())); };
export const getAreasByParent = params => { return util.checkToken(openapi_server.get(`/area/getAreasByParent/` + params, getConfig())); };
export const getParentAreaId = params => { return util.checkToken(openapi_server.get(`/area/getParentAreaId/` + params, getConfig()));};
export const getSchoolTypeList = params => { return util.checkToken(openapi_server.get(`/school/getSchoolTypeList` + params, getConfig())); };
export const batchDeleteSchool = params => { return util.checkToken(openapi_server.post(`/school/batchDeleteSchool` , params, getConfig())); };
export const batchSetArea2School = params => { return util.checkToken(openapi_server.post(`/school/batchSetArea2School` , params, getConfig())); };
export const setOrdernoByOrgid = params => { return util.checkToken(openapi_server.post(`/school/setOrdernoByOrgid` , params, getConfig())); };

export const batchRegisterTeacher = params => { return util.checkToken(openapi_server.post(`/teacher/batchRegisterTeacher` , params, getConfig())); };
export const getTeacherList = params => { return util.checkToken(openapi_server.post(`/teacher/getTeacherList` , params, getConfig())); };
export const batchDeleteTeacher = params => { return util.checkToken(openapi_server.post(`/teacher/batchDeleteTeacher` , params, getConfig())); };
export const batchSetTeacherNamed = params => { return util.checkToken(openapi_server.post(`/teacher/batchSetTeacherNamed` , params, getConfig())); };
export const batchSetSharerange2Teacher = params => { return util.checkToken(openapi_server.post(`/teacher/batchSetSharerange2Teacher` , params, getConfig())); };
export const batchSetArea2Teacher = params => { return util.checkToken(openapi_server.post(`/teacher/batchSetArea2Teacher` , params, getConfig())); };
export const setOrdernoByUserid = params => { return util.checkToken(openapi_server.post(`/teacher/setOrdernoByUserid` , params, getConfig())); };

export const getItemList = params => { return util.checkToken(openapi_server.post(`/dictitem/getItemList` , params, getConfig())); };
export const insertItem = params => { return util.checkToken(openapi_server.post(`/dictitem/insertItem` , params, getConfig())); };
export const modifyItem = params => { return util.checkToken(openapi_server.post(`/dictitem/modifyItem` , params, getConfig())); };
export const removeItem = params => { return util.checkToken(openapi_server.get(`/dictitem/removeItem/` + params, getConfig())); };

export const getTypeList = params => { return util.checkToken(openapi_server.post(`/dicttype/getTypeList` , params, getConfig())); };
export const insertType = params => { return util.checkToken(openapi_server.post(`/dicttype/insertType` , params, getConfig())); };
export const modifyType = params => { return util.checkToken(openapi_server.post(`/dicttype/modifyType` , params, getConfig())); };
export const removeType = params => { return util.checkToken(openapi_server.get(`/dicttype/removeType/` + params, getConfig())); };

export const getAdvertList = params => { return util.checkToken(openapi_server.post(`/advret/getAdvretList` , params, getConfig())); };
export const removeAdvert = advertId => { return util.checkToken(openapi_server.get(`/advret/removeAdvret/` + advertId, getConfig())); };
export const setAdvertStatus = params => { return util.checkToken(openapi_server.post(`/advret/setAdvretStatus`, params, getConfig())); };
export const insertAdvert = params => { return util.checkToken(openapi_server.post(`/advret/insertAdvret`, params, getConfig())); };
export const modifyAdvert = params => { return util.checkToken(openapi_server.post(`/advret/modifyAdvret`, params, getConfig())); };

export const getFeedBackDataList = params => { return util.checkToken(openapi_server.post(`/feedback/getFeedbackList` , params, getConfig())); };
export const batchDeleteFeedback = params => { return util.checkToken(openapi_server.post(`/feedback/batchDelete` , params, getConfig())); };
export const setScore2Feedback = params => { return util.checkToken(openapi_server.post(`/feedback/setScore2Feedback` , params, getConfig())); };
export const auditFeedback = params => { return util.checkToken(openapi_server.post(`/feedback/auditFeedback` , params, getConfig())); };
export const getRewardResourceList = params => { return util.checkToken(openapi_server.post(`/resource/getRewardResourceList`, params, getConfig())); };

export const getScoreRule = params => { return util.checkToken(openapi_server.post(`/score/getScoreRule` , params, getConfig())); };
export const setScoreRule = params => { return util.checkToken(openapi_server.post(`/score/setScoreRule`, params, getConfig())); };

export const getOperationList = params => { return util.checkToken(openapi_server.post(`/option/getOptionList`, params, getConfig())); };
export const batchOptionDelete = params => { return util.checkToken(openapi_server.post(`option/batchOptionDelete`, params, getConfig())); };

export const getActionList = params => { return util.checkToken(openapi_server.post(`/action/getActionList` , params, getConfig())); };
export const batchActionDelete = params => { return util.checkToken(openapi_server.post(`/action/batchActionDelete` , params, getConfig())); };

export const getList = params => { return util.checkToken(openapi_server.post(`/synonym/getList`, params, getConfig())); };
export const insert = params => { return util.checkToken(openapi_server.post(`/synonym/insert`, params, getConfig())); };
export const modify = params => { return util.checkToken(openapi_server.post(`/synonym/modify`, params, getConfig())); };
export const remove = params => { return util.checkToken(openapi_server.post(`/synonym/remove`, params, getConfig())); };

export const addBadWord = params => { return util.checkToken(openapi_server.post('/config/addBadWord', params, getConfig()));};
export const getFileList = (params) => { return openapi_server.post(`/file/getListByFields`,params,getConfig());};

////////getImage//////////
export const setGoodThumbnail = params => { return util.checkToken(openapi_server.post(`good/setGoodThumbnail`, params, getConfig())); };
/////////////////////////
// ECO API
export const uploadFile = params => {
	return openapi_server.post('twasp/fs/fs/file/upload', params.data, 
		{ 
			baseURL: ECOAPI_SERVER, 
			headers: {
				'user-agent':'Mozilllla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;)',
				'Content-Type':'multipart/form-data;charset=UTF-8',
				'Host':'****',
				'Accept-Encoding':'gzip',
				'charset':'utf-8',
				'branchCode': BRANCH_CODE
			},
			onUploadProgress: params.onUploadProgress
		}
	);
};

const getEcoBaseAPIConfig = params => {
	return {
			baseURL: ECOAPI_SERVER + 'openapi-base',
			headers: {
				'access-token':localStorage.getItem('backend-token'),
				'Content-Type':'application/json',
				'Tenant-Id': TENANT_ID
			}
		};
};

const getEcoUCAPIConfig = params => {
	return {
			baseURL: ECOAPI_SERVER + 'openapi-uc',
			headers: {
				'access-token':localStorage.getItem('backend-token'),
				'Content-Type':'application/json'
			}
		};
};
const getEcoUCAPIConfig1 = params => {
	return {
			baseURL: ECOAPI_SERVER + 'openapi-uc',
			headers: {
				'Content-Type':'application/json',
				'access-token':localStorage.getItem('backend-token'),
				'Current-Org-Id':JSON.parse(localStorage.getItem('backend-user')).orgId,
				'X-User-Account':JSON.parse(localStorage.getItem('backend-user')).userId
			}
		};
};
const getECOFileAPIConfig = params => {
	return {
			baseURL: ECOAPI_SERVER + 'fs/fs',
			headers: {
				'Content-Type':'application/json'
			}
		};
};

export const updatePwdECO = (params, message) => { return util.checkECOToken(openapi_server.post(`/uc/updatePwd`, params, getEcoUCAPIConfig()), message); };
export const getEcoSearchSchool = (params, message) => { return util.checkECOToken(openapi_server.post(`/base/joinSearchSchools`, params, getEcoBaseAPIConfig()), message); };
export const getEcoTeacherList = (params, message) => { return util.checkECOToken(openapi_server.post(`/uc/search`, params, getEcoUCAPIConfig1()), message); };
export const getEcoSchoolList = (params, message) => { return util.checkECOToken(openapi_server.post(`/org/searchApi`, params, getEcoUCAPIConfig()), message); };
export const getEcoOrgInfo = (orgId, message) => { return util.checkECOToken(openapi_server.get(`/org/` + orgId, getEcoUCAPIConfig()), message); };
export const getThumbnail = (params, message) => { return openapi_server.post(`/getImage`, params, getECOFileAPIConfig()); };
export const getWaterMarkToImage = (params, message) => { return util.checkECOToken(openapi_server.post(`/uc/getWaterMarkToImage`, params, getEcoUCAPIConfig()), message); };
