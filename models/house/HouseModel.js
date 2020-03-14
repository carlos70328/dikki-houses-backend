const ModelInterface = require('../interfaces/ModelInterface');

class HouseModel extends ModelInterface {

    /**
     * 
     * @param {DatabaseInterface} driver : driver to make actions in database
     * @param {string} modelName : name to representate the object
     * @param {HouseSchema} houseSchema : valid schema for create model
     */
    constructor(driver, modelName, schema){
        super(driver, modelName, schema);
        this._houseModel = this.driver.createModel(this.modelName, this.schema);
    }

}

module.exports = HouseModel;