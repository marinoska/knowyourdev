import { createQueryKeys } from './queryKeysFactory.js';

describe('react-query-utils/queryKeysFactory', () => {
    describe('createQueryKeys', () => {
        const DEFAULT_KEY = 'omnipresent';

        it('creates factory with only default property if called with one parameter', () => {
            const queryKeys = createQueryKeys(DEFAULT_KEY);

            expect(queryKeys).toMatchObject({
                default: ['omnipresent']
            });
        });

        it('creates default key as an array with only one string', () => {
            const queryKeys = createQueryKeys(DEFAULT_KEY);

            expect(Array.isArray(queryKeys.default)).toBeTruthy();
            expect(queryKeys.default).toHaveLength(1);
        });

        it('merges default factory with returned object of second parameter', () => {
            const queryKeys = createQueryKeys(DEFAULT_KEY, createKey => ({
                omniatlas: createKey('omniatlas'),
                payroll: createKey('payroll')
            }));

            expect(queryKeys).toHaveProperty('default');
            expect(queryKeys).toHaveProperty('omniatlas');
            expect(queryKeys).toHaveProperty('payroll');
        });

        it('creates derived keys with pattern [default_key, ...parameters]', () => {
            const queryKeys = createQueryKeys(DEFAULT_KEY, createKey => ({
                omniatlas: createKey('omniatlas'),
                timeoffLogs: (status: string) => createKey('timeoff-logs', {status})
            }));

            expect(Array.isArray(queryKeys.omniatlas)).toBeTruthy();
            expect(Array.isArray(queryKeys.timeoffLogs('taken'))).toBeTruthy();

            expect(queryKeys.omniatlas).toStrictEqual(['omnipresent', 'omniatlas']);
            expect(queryKeys.timeoffLogs('taken')).toStrictEqual([
                'omnipresent',
                'timeoff-logs',
                {status: 'taken'}
            ]);
        });
    });
});
