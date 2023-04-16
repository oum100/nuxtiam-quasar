import {Breadcrumb} from '@/utils/types';

export default function useUtils() {
    return{
        getBreadcrumb,
    };
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