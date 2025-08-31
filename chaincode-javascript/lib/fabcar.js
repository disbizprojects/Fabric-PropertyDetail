/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');


class PropertyContract extends Contract {


    async initLedger(ctx) {
        console.info('============= START : Initialize Property Ledger ===========');
        const properties = [
            {
                propertyId: '001',
                address: '123 Main St',
                city: 'dhaka',
                property_size: '1200',
                owner_name: 'Ali',
                property_type: 'Apartment',
            },
            {
                propertyId: '002',
                address: '456 Ave',
                city: 'Ctg',
                property_size: '2000',
                owner_name: 'Babul',
                property_type: 'House',
            },
        ];
        for (let i = 0; i < properties.length; i++) {
            properties[i].docType = 'property';
            await ctx.stub.putState(properties[i].propertyId, Buffer.from(JSON.stringify(properties[i])));
            console.info('Added <--> ', properties[i]);
        }
        console.info('============= END : Initialize Property Ledger ===========');
    }



    // Get property by unique ID
    async getPropertyById(ctx, propertyId) {
        const propAsBytes = await ctx.stub.getState(propertyId);
        if (!propAsBytes || propAsBytes.length === 0) {
            throw new Error(`Property with ID ${propertyId} does not exist`);
        }
        return propAsBytes.toString();
    }



    // Add new property (with duplicate check)
    async addProperty(ctx, propertyId, address, city, property_size, owner_name, property_type) {
        const exists = await ctx.stub.getState(propertyId);
        if (exists && exists.length > 0) {
            throw new Error(`Property with ID ${propertyId} already exists`);
        }
        const property = {
            address,
            city,
            property_size,
            owner_name,
            property_type,
            docType: 'property',
        };
        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));
    }


    // Get all properties
    async getAllProperties(ctx) {
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange('', '')) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                record = strValue;
            }
            if (record.docType === 'property') {
                allResults.push({ Key: key, Record: record });
            }
        }
        return JSON.stringify(allResults);
    }



    // Update property info (only if exists)
    async updateProperty(ctx, propertyId, address, city, property_size, owner_name, property_type) {
        const propAsBytes = await ctx.stub.getState(propertyId);
        if (!propAsBytes || propAsBytes.length === 0) {
            throw new Error(`Property with ID ${propertyId} does not exist`);
        }
        const property = JSON.parse(propAsBytes.toString());
        property.address = address;
        property.city = city;
        property.property_size = property_size;
        property.owner_name = owner_name;
        property.property_type = property_type;
        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));
    }

    // Search properties by city
    async getPropertiesByCity(ctx, city) {
        const results = [];
        for await (const {key, value} of ctx.stub.getStateByRange('', '')) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                record = strValue;
            }
            if (record.docType === 'property' && record.city === city) {
                results.push({ Key: key, Record: record });
            }
        }
        return JSON.stringify(results);
    }


}

module.exports = PropertyContract;
