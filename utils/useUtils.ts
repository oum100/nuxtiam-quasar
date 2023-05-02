import {Breadcrumb} from '@/utils/types';
import {JSONPath} from 'jsonpath-plus'
import {jmesPath} from 'jmespath'
import {jp} from 'jsonpath'

export default function useUtils() {
    return{
        getBreadcrumb,
        JSONPathPlus,
        JMESPath,
        jsonpath,
    };
}

const jj = {
  "response":"ping",
  "merchantid":"10000105",
  "uuid":"3R2RRMI13FQCFFE",
  "rssi":-52,
  "state":"Available",
  "firmware":"1.0.6",
  "timeRemain":0
}

function getBreadcrumb() {
    const route = useRoute()
      
    const pathArray = route.path.split('/')
    pathArray.shift()
    const breadcrumbs = pathArray.reduce((breadcrumbArray:any, path, idx) => {
      breadcrumbArray.push({
        to: !!breadcrumbArray[idx - 1]
          ? breadcrumbArray[idx - 1].to + '/' + path
          : '/' + path,
        title: path.toString().replace('-', ' '),
      })
      return breadcrumbArray
    }, [])
    return breadcrumbs
}

function showState(state:string){

}

function showStatus(status:string){

}

function JSONPathPlus(json:any, path:string){
  const aa = JSON.parse(json)
  const result = JSONPath({path:path,json:aa})
  console.log('JSONPath-Plus',result)
  return result
}

function JMESPath(json:any, path:string){
  const aa = JSON.parse(json)
  const result = jmesPath.search(aa, path)
  console.log('jmesPath',result)
  return result
}

function jsonpath(json:any, path:string){
  const aa = JSON.parse(json)
  const result = jp.query(aa,path)
  console.log('jsonPath',result)
  return result
}