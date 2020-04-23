/*
 *  Copyright 2020 EPAM Systems
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { Attribute, LogRQ, StorageTestItem } from '../../../models';
import { RealTimeReporter } from '../../../realTimeReporter';
import { getDefaultMockConfig, getStorageTestItemMock, RPClientMock, StorageMock } from '../../mocks';
import * as utils from "../../../realTimeReporter/utils";
import { FILE_TYPES, LOG_LEVELS } from '../../../constants';

describe('testItemReporting', function () {
  let reporter: RealTimeReporter;
  let storage: StorageMock;

  beforeEach(() => {
    const config = getDefaultMockConfig();
    const client = new RPClientMock();
    storage = new StorageMock();

    reporter = new RealTimeReporter(config);
    // @ts-ignore access to the class private property
    reporter.client = client;
    // @ts-ignore access to the class private property
    reporter.storage = storage;
    // @ts-ignore access to the class private property
    reporter.launchId = 'tempLaunchId';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendLogToItem', function () {
    const logItemRQObj: { log: LogRQ; suite?: string } = {
      log: {
        level: LOG_LEVELS.INFO,
        message: 'Log message',
      },
      suite: 'itemName',
    };

    let spyGetCurrentItem: jest.SpyInstance;
    let spySetDefaultFileType: jest.SpyInstance;

    beforeEach(() => {
      spyGetCurrentItem = jest.spyOn(storage, 'getCurrentItem').mockReturnValue({
        id: 'testItemId'
      });
      spySetDefaultFileType = jest.spyOn(utils, 'setDefaultFileType');
    });

    test('invokes the storage getCurrentItem method with item suite name to receive current item id', function () {
      // @ts-ignore access to the class private property
      reporter.sendLogToItem(logItemRQObj);

      expect(spyGetCurrentItem).toHaveBeenCalledWith(logItemRQObj.suite);
    });

    test('invokes the util setDefaultFileType function to set default type for file', function () {
      // @ts-ignore access to the class private property
      reporter.sendLogToItem(logItemRQObj);

      expect(spySetDefaultFileType).toHaveBeenCalledWith(logItemRQObj.log.file);
    });

    test('should call the client sendLog method to send item log to Report Portal', function () {
      const { log: { file, ...log } } = logItemRQObj;

      spySetDefaultFileType.mockReturnValueOnce(undefined);

      // @ts-ignore access to the class private property
      reporter.sendLogToItem(logItemRQObj);

      // @ts-ignore access to the class private property
      expect(reporter.client.sendLog).toHaveBeenCalledWith('testItemId', log, undefined);
    });
  });

  describe('sendLogToLaunch', function () {
    const logItemRQObj: LogRQ = {
      level: LOG_LEVELS.INFO,
      message: 'Log message',
      file: {
        name: 'fileName',
        content: 'file content',
        type: FILE_TYPES.TEXT,
      },
    };

    let spySetDefaultFileType: jest.SpyInstance;

    beforeEach(() => {
      spySetDefaultFileType = jest.spyOn(utils, 'setDefaultFileType');
    });

    test('invokes the util setDefaultFileType function to set default type for file', function () {
      // @ts-ignore access to the class private property
      reporter.sendLogToLaunch(logItemRQObj);

      expect(spySetDefaultFileType).toHaveBeenCalledWith(logItemRQObj.file);
    });

    test('should call the client sendLog method to send launch log to Report Portal', function () {
      const { file, ...log } = logItemRQObj;

      spySetDefaultFileType.mockReturnValueOnce(file);

      // @ts-ignore access to the class private property
      reporter.sendLogToLaunch(logItemRQObj);

      // @ts-ignore access to the class private property
      expect(reporter.client.sendLog).toHaveBeenCalledWith('tempLaunchId', log, file);
    });
  });

  describe('addItemAttributes', function () {
    const attributesData: { attributes: Array<Attribute>, suite?: string } = {
      attributes: [{ value: 'attributeValue', key: 'attributeKey' }],
      suite: 'suiteName',
    };

    let storageItem: StorageTestItem;
    let spyGetCurrentItem: jest.SpyInstance;

    beforeEach(() => {
      storageItem = getStorageTestItemMock('testItem');
      spyGetCurrentItem = jest.spyOn(storage, 'getCurrentItem').mockReturnValue(storageItem);
    });

    test('invokes the storage getCurrentItem method with item suite name to get item from storage', function () {
      // @ts-ignore access to the class private property
      reporter.addItemAttributes(attributesData);

      expect(spyGetCurrentItem).toHaveBeenCalledWith(attributesData.suite);
    });

    test('should update attributes for item in storage', function () {
      // @ts-ignore access to the class private property
      reporter.addItemAttributes(attributesData);

      const updatedStorageItem: StorageTestItem = getStorageTestItemMock('testItem');
      updatedStorageItem.attributes = [
        ...updatedStorageItem.attributes,
        { value: 'attributeValue', key: 'attributeKey' },
      ];

      expect(storageItem).toEqual(updatedStorageItem);
    });
  });

  describe('setItemDescription', function () {
    const attributesData: { text: string, suite?: string } = {
      text: 'New item description',
      suite: 'suiteName',
    };

    let storageItem: StorageTestItem;
    let spyGetCurrentItem: jest.SpyInstance;

    beforeEach(() => {
      storageItem = getStorageTestItemMock('testItem');
      spyGetCurrentItem = jest.spyOn(storage, 'getCurrentItem').mockReturnValue(storageItem);
    });

    test('invokes the storage getCurrentItem method with item suite name to get item from storage', function () {
      // @ts-ignore access to the class private property
      reporter.setItemDescription(attributesData);

      expect(spyGetCurrentItem).toHaveBeenCalledWith(attributesData.suite);
    });

    test('should change description for item in storage', function () {
      // @ts-ignore access to the class private property
      reporter.setItemDescription(attributesData);

      const updatedStorageItem: StorageTestItem = getStorageTestItemMock('testItem');
      updatedStorageItem.description = 'New item description';

      expect(storageItem).toEqual(updatedStorageItem);
    });
  });

});


