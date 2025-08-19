import { goTofailure } from '../router'

const serverPort = VITE__RUN__SERVER_PORT
const mainApiPrefix = VITE__MAIN_API_PREFIX
const secondaryApiPrefix = VITE__SECONDARY_API_PREFIX

const apiServer = `http://localhost:${serverPort}`
const api_prefix = `${mainApiPrefix}${secondaryApiPrefix}`

const baseFetch = async (url, config = {}, params) => {
    const defaultHeaders = {
        'Content-Type': 'application/json'
    }

    const _config = {
        headers: {
            ...defaultHeaders,
            ...(config.headers || {})
        },
        ...config
    }

    if (params) {
        _config.body = JSON.stringify(params)
    }

    try {
        const response = await fetch(`${apiServer}${api_prefix}${url}`, _config)
        const data = await response.json()

        if (response.status >= 500) {
            goTofailure()
            throw { status: response.status, data }
        }

        return {
            status: response.status,
            ok: response.ok,
            data
        }
    } catch (err) {
        goTofailure()
        throw err
    }
}

const fetchGet = (url, config) => {
    return baseFetch(url, config)
}

const fetchPost = (url, params = {}, config = {}) => {
    return baseFetch(url, {
        ...config,
        method: 'POST'
    }, params)
}

const fetchPut = (url, params = {}, config = {}) => {
    return baseFetch(url, {
        ...config,
        method: 'PUT'
    }, params)
}
const fetchPatch = (url, params = {}, config = {}) => {
    return baseFetch(url, {
        ...config,
        method: 'PATCH'
    }, params)
}

const fetchDelete = (url, params = {}, config = {}) => {
    return baseFetch(url, {
        ...config,
        method: 'DELETE'
    }, params)
}

export default {
    get: fetchGet,
    post: fetchPost,
    put: fetchPut,
    patch: fetchPatch,
    delete: fetchDelete,
}