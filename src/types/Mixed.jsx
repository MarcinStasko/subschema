import React from 'react';
import CollectionMixin from './CollectionMixin.jsx';
import {isString} from '../tutils';
import style from 'subschema-styles/Mixed-style';
import _get from 'lodash/object/get';
import defaults from 'lodash/object/defaults';
import PropTypes from '../PropTypes';
var typetype = PropTypes.oneOfType([PropTypes.shape({type: PropTypes.string}), PropTypes.string])
export default class MixedInput extends CollectionMixin {

    static propTypes = defaults({
        labelKey: PropTypes.string,
        keyType: typetype,
        valueType: typetype,
        value: PropTypes.object,

    }, CollectionMixin.propTypes);

    static defaultProps = defaults({
        showKey: true,
        valueType: {type: 'Text'},
        keyType: {type: 'Text'}
    }, CollectionMixin.defaultProps)

    unwrap(value) {
        var ret = {}
        if (value == null) {
            return ret;
        }
        value.forEach(function (v) {
            ret[v.key] = v.value;
        });
        return ret;
    }

    uniqueCheck = (value)=> {
        var values = this.getValue();
        if (this.state.editPid == value) {
            return null;
        }
        if (value in values) {

            return {
                message: 'Keys must be unique'
            }

        }
        return null;
    }

    createPid() {
        return 'new_property_' + (this.state.wrapped.length);
    }

    createDefValue() {
        return {};
    }

    getTemplateItem() {
        var kt = this.props.keyType,
            keyType = isString(kt) ? {
                type: kt
            } : kt || {},
            schema = {
                key: keyType,
                value: this.props.itemType || this.props.valueType
            };

        if (!keyType.type) {
            keyType.type = this.props.keyType;
        }

        (keyType.validators || (keyType.validators = [])).unshift('required', this.uniqueCheck);

        return schema;
    }


}
