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

import { V1StatusCause } from './v1StatusCause';

export class V1StatusDetails {
    'causes'?: Array<V1StatusCause>;
    'group'?: string;
    'kind'?: string;
    'name'?: string;
    'retryAfterSeconds'?: number | null;
    'uid'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "causes",
            "baseName": "causes",
            "type": "Array<V1StatusCause>"
        },
        {
            "name": "group",
            "baseName": "group",
            "type": "string"
        },
        {
            "name": "kind",
            "baseName": "kind",
            "type": "string"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "retryAfterSeconds",
            "baseName": "retryAfterSeconds",
            "type": "number"
        },
        {
            "name": "uid",
            "baseName": "uid",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return V1StatusDetails.attributeTypeMap;
    }
}

