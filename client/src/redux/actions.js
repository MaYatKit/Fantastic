// Define action types here

const TEST_ACTION = "TEST_ACTION"
const TEST_ADD_MOCKDATA = "TEST_ADD_MOCKDATA"




// define action creators here
let testActionCreator = (content) => {
    return {
        type: TEST_ACTION,
        content: content
    }
}


export {testActionCreator}