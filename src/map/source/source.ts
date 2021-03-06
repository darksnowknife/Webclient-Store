import { MapRender } from '../document';
import { deepCopy, deepEqual } from '../../utils/deepequal';

export enum SourceType {
    Default = "Default",
    IGServer = "IGServer",
    DataStore = "DataStore",
    GeoJson = "GeoJson",
    VectorTile = "VectorTile",
    RasterTile = "RasterTile",
    M3D = "M3D"
}

export class Source {
    name: string;
    type: SourceType;
    url: string;
    min?: number;
    max?: number;
    description?: string;
    
    static parseSources(sources: Object, mapRender: MapRender) {
        let result = deepCopy(sources);
        if (mapRender == MapRender.MapBoxGL) {
            for (let key in result) {
                let source = result[key];
                let type = 'vector'
                switch (source.type) {
                    case SourceType.VectorTile:
                        type = 'vector';
                        break;
                    case SourceType.RasterTile:
                        type = 'raster';
                        break;
                    case SourceType.GeoJson:
                        type = 'geojson';
                        break;
                }
                source.type = type;
                source.tiles = [source.url];
                source.minZoom = source.min;
                source.maxZoom = source.max;
            }
        } else if (mapRender == MapRender.Cesium) {

        }
        return result;
    }

    /**
     * @description 将新的数据源添加到数据源集合对象中
     * @param sources - {Object} 数据源集合对象
     * @param sourceKey - {String} 新增数据源名称
     * @param sourceValue - {Source} 新增数据源值
     * @param sources - {MapRender} 地图渲染引擎
     **/
    static addSource(sources: Object, sourceValue: Source, sourceKey: string,
        mapRender?: MapRender) {
        let news: Object = deepCopy(sources);
        if (!mapRender || mapRender == MapRender.MapBoxGL) {
            news[sourceKey] = sourceValue;
        } else {
            //         news[sourceKey] = sourceValue;
        }
        return news;
    }

    static compareSource(sourcea: Source, sourceb: Source) {
        if (!sourcea || !sourceb) {
            return false
        } else if (sourcea.type != sourceb.type) {
            return false
        } else if (sourcea.url != sourceb.url) {
            return false
        }
        return true
    }

    static compareSources(sourcesa: Object, sourcesb: Object) {
        if (!sourcesa || !sourcesb) return false
        if (deepEqual(sourcesa, sourcesb)) return true
        let keys_a = Object.keys(sourcesa)
        let keys_b = Object.keys(sourcesb)
        if (keys_a.length != keys_b.length) {
            return false
        }
    }
}

export const defaultSource: Source = {
    name: "默认数据源",
    type: SourceType.Default,
    url: "localhost",
    min: 0,
    max: 24,
    description: "默认数据源提供一个默认的空的背景底图，该底图不显示作为游标定位其他图层.默认数据源前端代码内置的无法删除."
};
export const vtSource: Source = {
    name: "IGServer",
    type: SourceType.VectorTile,
    url: "http://192.168.10.186:6163/igs/rest/mrms/tile/矢量瓦片湖北/{z}/{y}/{x}?type=cpbf",
    min: 0,
    max: 24,
    description: "IGServer矢量瓦片数据源测试案例."
};
export const defaultSources: Object = {
    "默认数据源": defaultSource,
    "IGServer": vtSource
};
