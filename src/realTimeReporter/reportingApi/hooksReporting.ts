import { FinishTestItemRQ, StartTestItemRQ } from '../../models';
import { EVENTS, TEST_ITEM_TYPES } from '../../constants';
import { publishEvent, getCodeRef } from '../utils';

export interface HooksReportingInterface {
    startBeforeSuite(data: StartTestItemRQ): void;
    finishBeforeSuite(data: FinishTestItemRQ): void;

    startAfterSuite(data: StartTestItemRQ): void;
    finishAfterSuite(data: FinishTestItemRQ): void;

    startBeforeTestCase(data: StartTestItemRQ): void;
    finishBeforeTestCase(data: FinishTestItemRQ): void;

    startAfterTestCase(data: StartTestItemRQ): void;
    finishAfterTestCase(data: FinishTestItemRQ): void;
}

export const hooksReporting: HooksReportingInterface = {
    startBeforeSuite(data: StartTestItemRQ): void {
        const hookName = 'Before suite';
        const codeRef = getCodeRef(hookName);

        const suiteObj = {
            type: TEST_ITEM_TYPES.BEFORE_SUITE,
            name: hookName,
            codeRef,
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
    },

    finishBeforeSuite(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, { name: 'Before suite', ...data });
    },

    startAfterSuite(data: StartTestItemRQ): void {
        const hookName = 'After suite';
        const codeRef = getCodeRef(hookName);

        const suiteObj = {
            type: TEST_ITEM_TYPES.AFTER_SUITE,
            name: hookName,
            codeRef,
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
    },

    finishAfterSuite(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, { name: 'After suite', ...data });
    },

    startBeforeTestCase(data: StartTestItemRQ): void {
        const hookName = 'Before test';
        const codeRef = getCodeRef(hookName);

        const suiteObj = {
            type: TEST_ITEM_TYPES.BEFORE_TEST,
            name: hookName,
            codeRef,
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
    },

    finishBeforeTestCase(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, { name: 'Before test', ...data });
    },

    startAfterTestCase(data: StartTestItemRQ): void {
        const hookName = 'After test';
        const codeRef = getCodeRef(hookName);

        const suiteObj = {
            type: TEST_ITEM_TYPES.AFTER_TEST,
            name: hookName,
            codeRef,
            ...data,
        };

        publishEvent(EVENTS.START_TEST_ITEM, suiteObj);
    },

    finishAfterTestCase(data: FinishTestItemRQ): void {
        publishEvent(EVENTS.FINISH_TEST_ITEM, { name: 'After test', ...data });
    },
};
