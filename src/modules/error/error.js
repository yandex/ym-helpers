/* global console */

ym.modules.define('error', ['util.defineClass', 'util.extend'], function (provide, defineClass, extend) {
    var errors = {
        /**
         * Вспомогательная функция для создания ошибки.
         * @function
         * @name error.create
         * @static
         * @param {String} errorType Тип ошибки (из пространства имен error.*).
         * @param {String} [message] Текст ошибки.
         */
        create: function (errorType, message) {
            if (!errors[errorType]) {
                errors.log('ProcessError', errorType + ': is undefined error type');
            } else {
                return new errors[errorType](message);
            }
        },

        /**
         * Бросает исключение в режиме `debug`.
         * @function
         * @name error.throwException
         * @static
         * @param {String|Error} errorType Тип ошибки (из пространства имен error.*) или объект ошибки.
         * @param {String} [message] Текст ошибки.
         */
        throwException: function (errorType, message) {
            if (ym.env.debug) {
                throw (typeof errorType == 'object' ? errorType : errors.create(errorType, message));
            }
        },

        /**
         * Бросает исключение в режиме `debug`, если условие выполняется.
         * @function
         * @name error.throwExceptionIf
         * @static
         * @param {Boolean} condition Условие бросания исключения.
         * @param {String|Error} errorType Тип ошибки (из пространства имен error.*) или объект ошибки.
         * @param {String} [message] Текст ошибки.
         */
        throwExceptionIf: function (condition, errorType, message) {
            if (condition) {
                errors.throwException(errorType, message);
            }
        },

        /**
         * Выводит в `console.warn` предупреждение в режиме `debug`.
         * @function
         * @name error.warn
         * @static
         * @param {String|Error} errorType Тип ошибки (из пространства имен error.*) или объект ошибки.
         * @param {String} [message] Текст предупреждения.
         */
        warn: function (errorType, message) {
            if (ym.env.debug && typeof console == 'object' && console.warn) {
                var originalError = typeof errorType == 'object' ? errorType : errors.create(errorType, message),
                    err = new Error(originalError.name + ': ' + originalError.message);

                err.stack = originalError.stack;

                // `console.warn` does not show stack for custom errors.
                console.warn(err);
            }
        },

        /**
         * Выводит в `console.warn` предупреждение в режиме `debug`, если условие выполняется.
         * @function
         * @name error.warnIf
         * @static
         * @param {Boolean} condition Условие отображения предупреждения.
         * @param {String|Error} errorType Тип ошибки (из пространства имен error.*) или объект ошибки.
         * @param {String} [message] Текст ошибки.
         */
        warnIf: function (condition, errorType, message) {
            if (condition) {
                errors.warn(errorType, message);
            }
        }
    };

    function createErrorClass (name, errorClass) {
        function YMError (message) {
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, this.constructor);
            } else {
                this.stack = (new Error()).stack;
            }

            this.name = name;
            this.message = message;
        }

        if (errorClass) {
            YMError.errorClass = errorClass;
        }

        errors[name] = YMError;

        return YMError;
    }
    /**
     * Базовая ошибка карт
     * @ignore
     * @class
     * @auments Error
     */
    var YMError = createErrorClass('_YMError');
    defineClass(YMError, Error);


    /**
     * Критические ошибки при выполнении операций.
     * Эти ошибки вызваны некорректным использованием API и должны быть исправлены разработчиком.
     * @class Расширяет <xref scope="external" href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Error">Error</xref>.
     * @name error.ClientError
     */

    var ClientError = createErrorClass('ClientError');
    defineClass(ClientError, YMError);
    if (1) {
        /**
         * Некорректные входные данные (аргументы, параметры, опции).
         * - Отсутствующий DOM-элемент контейнера карты
         * - Несуществующий тип геометрии
         * - Некорректные значения опций strokeColor, fillRule и т.д.
         * @class
         * @name error.InputError
         * @augments error.ClientError
         */
        var InputError = createErrorClass('InputError', 'ClientError');
        defineClass(InputError, ClientError);

        /**
         * Неподходящее состояние.
         * - Попытка расчета вхождения точки в геометрию, когда она не добавлена на карту
         * - Запрос оверлея у геообъекта, когда он не добавлен на карту
         * - Открытие "задестроенного" балуна
         * - Вызов метода showResult контрола поиска до того, как были загружены данные
         * @class
         * @name error.StateError
         * @augments error.ClientError
         */
        var StateError = createErrorClass('StateError', 'ClientError');
        defineClass(StateError, ClientError);

        /**
         * Ошибки доступа к компонентам, их методам и данным.
         * - Нет шейпа при автопане, хотя балун открыт
         * - Невозможность получить проекцию из опций карты
         * - У менеджера балуна отсутствует метод capture
         * - У координатной системы отсутствует метод solveDirectProblem
         * @class
         * @name error.ProcessError
         * @augments error.ClientError
         */
        var ProcessError = createErrorClass('ProcessError', 'ClientError');
        defineClass(ProcessError, ClientError);

        /**
         * Отсутствие элемента или ключа в хранилище.
         * @class
         * @name error.StorageItemAccessError
         * @augments error.ClientError
         */
        var StorageItemAccessError = createErrorClass('StorageItemAccessError', 'ClientError');
        defineClass(StorageItemAccessError, ClientError);

        /**
         * Функциональность больше не доступна в текущей версии.
         * @class
         * @name error.FeatureRemovedError
         * @augments error.ClientError
         */
        var FeatureRemovedError = createErrorClass('FeatureRemovedError', 'ClientError');
        defineClass(FeatureRemovedError, ClientError);

    }
    /**
     * Ошибки внешних ресурсов или окружения.
     * Эти ошибки не связаны с кодом приложения, использующего API, но они могут и должны правильно обрабатываться разработчиком.
     * @class Расширяет <xref scope="external" href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Error">Error</xref>.
     * @name error.ExternalError
     */
    var ExternalError = createErrorClass('ExternalError');
    defineClass(ExternalError, YMError);
    if (1) {
        /**
         * Ошибка асинхронного запроса. Например, отказ или таймаут удаленного сервера
         * @class
         * @name error.RequestError
         * @augments error.ExternalError
         */
        var RequestError = createErrorClass('RequestError', 'ExternalError');
        defineClass(RequestError, ExternalError);

        /**
         * Некорректный ответ сервера.
         * @class
         * @name error.DataProcessingError
         * @augments error.ExternalError
         */
        var DataProcessingError = createErrorClass('DataProcessingError', 'ExternalError');
        defineClass(DataProcessingError, ExternalError);

        /**
         * Закрыт доступ к действию.
         * @class
         * @name error.AccessError
         * @augments error.ExternalError
         */
        var AccessError = createErrorClass('AccessError', 'ExternalError');
        defineClass(AccessError, ExternalError);

        /**
         * Действие нельзя выполнить в текущем окружении.
         * @class
         * @name error.NotSupportedError
         * @augments error.ExternalError
         */
        var NotSupportedError = createErrorClass('NotSupportedError', 'ExternalError');
        defineClass(NotSupportedError, ExternalError);


    }
    /**
     * Ожидаемые причины отмены promise-ов.
     * @class Расширяет <xref scope="external" href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Error">Error</xref>.
     * @name error.Reject
     */
    var Reject = createErrorClass('Reject');
    defineClass(Reject, YMError);
    if (1) {
        /**
         * Действие не должно быть выполнено.
         * - Не нужно открывать пустой балун
         * - Менеджер запретил выполнение метода разделяемой сущности
         * - Не нужно закрывать хинт, если над ним находится курсор
         * @class
         * @name error.OperationUnallowedReject
         * @augments error.Reject
         */
        var OperationUnallowedReject = createErrorClass('OperationUnallowedReject', 'Reject');
        defineClass(OperationUnallowedReject, Reject);

        /**
         * Действие было отменено.
         * - Сначала спросили оверлей геообъекта, а затем задали ему опцию visible: false
         * - Сначала спросили макет контрола, а затем удалили его с карты
         * - Начали рисовать в режиме 'drawing', переключились на режим 'editing'
         * @class
         * @name error.OperationCanceledReject
         * @augments error.Reject
         */
        var OperationCanceledReject = createErrorClass('OperationCanceledReject', 'Reject');
        defineClass(OperationCanceledReject, Reject);

        /**
         * Пустой результат.
         * @class
         * @name error.EmptyResultReject
         * @augments error.Reject
         */
        var EmptyResultReject = createErrorClass('EmptyResultReject', 'Reject');
        defineClass(EmptyResultReject, Reject);

        /**
         * Недоступная интерфейсная функциональность.
         * @class
         * @name error.OperationUnawailableReject
         * @augments error.Reject
         */
        var OperationUnawailableReject = createErrorClass('OperationUnavailableReject', 'Reject');
        defineClass(OperationUnawailableReject, Reject);
    }

    /**
     * Предупреждения.
     * Предупреждения не являются критическими ошибками, тем не менее должны быть исправлены разработчиком. Они не кидаются как исключения, а только выводятся в консоль в debug-режиме.
     * @class Расширяет <xref scope="external" href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Error">Error</xref>.
     * @name error.Warning
     */
    var Warning = createErrorClass('Warning');
    defineClass(Warning, YMError);
    if (1) {
        /**
         * Функция запланирована к удалению.
         * - Вместо отдельных пакетов необходимо подключать package.full
         * - Модуль hotspot.ObjectSource заменен на hotspot.layer.ObjectSource
         * @class
         * @name error.DeprecationWarning
         * @augments error.Warning
         */
        var DeprecationWarning = createErrorClass('DeprecationWarning', 'Warning');
        defineClass(DeprecationWarning, Warning);

        /**
         * Операция не имеет смысла.
         * - Удаляемый элемент не найден в коллекции
         * - Объект уже был удален с карты/уничтожен
         * - Метод setType задаёт в карту тот же тип, что отображается в настоящий момент
         * - Уже был добавлен контрол с таким ключом на карту
         * - Уже был навешен обработчик такого события по умолчанию
         * @class
         * @name error.OveruseWarning
         * @augments error.Warning
         */
        var OveruseWarning = createErrorClass('OveruseWarning', 'Warning');
        defineClass(OveruseWarning, Warning);

    }

    provide(errors);
});
