import { epsgId } from './epsg';
import { ProjectTool } from './proj4tool';

export interface Project {
    projectPoint(lonlat);
    unprojectPoint(point);
}

export class Crs implements Project {

    /**
     * @description EPSG对应的编号
     * @see http://epsg.io/
     */
    epsg: string;

    /**
     * @description Proj4对应的规则
     * @see https://github.com/proj4js/proj4js
     */
    proj: string;

    constructor(epsg, proj) {
        this.epsg = epsg
        this.proj = proj
    }

    /**
     * @description 点-正向投影  经纬度->平面坐标
     * @param lonlat 
     */
    projectPoint(lonlat: Array<number>) {
        let id = epsgId(this.epsg)
        let source = ProjectTool.getProj4sDetail(4326)
        let destination = ''

        if (this.epsg && !this.proj) {
            destination = ProjectTool.getProj4sDetail(id)
        } else if (this.proj) {
            destination = this.proj
        } else {
            return [0, 0]
        }

        return ProjectTool.proj4Transform(source, destination, lonlat)
    }

    /**
     * @description 点-反向投影  平面坐标->经纬度
     * @param point 
     */
    unprojectPoint(point: Array<number>) {
        let id = epsgId(this.epsg)
        let source = ProjectTool.getProj4sDetail(4326)
        let destination = ''

        if (this.epsg && !this.proj) {
            destination = ProjectTool.getProj4sDetail(id)
        } else if (this.proj) {
            destination = this.proj
        } else {
            return [0, 0]
        }

        return ProjectTool.proj4Transform(destination, source, point)
    }

    static clone(crs: Crs) {
        let { epsg, proj } = crs
        let copy = new Crs(epsg, proj)
        return copy
    }
}

export function cloneCrs(crs: Crs) {
    let { epsg, proj } = crs
    let copy = new Crs(epsg, proj)
    return copy
}

export const defaultEpsg = "EPSG_3857"
export const defaultProj = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"
export const defaultCrs: Crs = new Crs(defaultEpsg, defaultProj)
