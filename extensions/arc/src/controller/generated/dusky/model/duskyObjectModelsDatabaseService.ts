/**
 * Dusky API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { DuskyObjectModelsDatabaseServiceArcPayload } from './duskyObjectModelsDatabaseServiceArcPayload';
import { DuskyObjectModelsDatabaseServiceSpec } from './duskyObjectModelsDatabaseServiceSpec';
import { DuskyObjectModelsDatabaseServiceStatus } from './duskyObjectModelsDatabaseServiceStatus';
import { V1ObjectMeta } from './v1ObjectMeta';

export class DuskyObjectModelsDatabaseService {
    'apiVersion'?: string;
    'kind'?: string;
    'metadata'?: V1ObjectMeta;
    'spec'?: DuskyObjectModelsDatabaseServiceSpec;
    'status'?: DuskyObjectModelsDatabaseServiceStatus;
    'arc'?: DuskyObjectModelsDatabaseServiceArcPayload;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "apiVersion",
            "baseName": "apiVersion",
            "type": "string"
        },
        {
            "name": "kind",
            "baseName": "kind",
            "type": "string"
        },
        {
            "name": "metadata",
            "baseName": "metadata",
            "type": "V1ObjectMeta"
        },
        {
            "name": "spec",
            "baseName": "spec",
            "type": "DuskyObjectModelsDatabaseServiceSpec"
        },
        {
            "name": "status",
            "baseName": "status",
            "type": "DuskyObjectModelsDatabaseServiceStatus"
        },
        {
            "name": "arc",
            "baseName": "arc",
            "type": "DuskyObjectModelsDatabaseServiceArcPayload"
        }    ];

    static getAttributeTypeMap() {
        return DuskyObjectModelsDatabaseService.attributeTypeMap;
    }
}

