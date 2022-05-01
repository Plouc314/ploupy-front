// next
import Head from 'next/head'
import { useRouter } from 'next/router'

// react
import { useEffect } from 'react'

// types
import { FC } from '../types'

// mui
import {
    Container,
} from '@mui/material'

// utils
import { useAuth } from '../utils/Firebase'

// components
import Loading from './Loading'

export interface PageProps {
    /**
     * Handeln the authentification, render the page only
     * if the user is logged in, otherwise render a loading page.
     */
    withAuth?: boolean
    /**
     * If the page needs the data of the db.
     * It will wait to have fetched them to render the page.
     */
    withData?: boolean
    /** The AppHeader won't be rendered */
    noAppHeader?: boolean
    /** The title set in the head tag */
    title: string
    /** Displayed in the AppHeader bar */
    headerActions?: JSX.Element
}

const Page: FC<PageProps> = (props) => {

    // doc: https://firebase.google.com/docs/auth/web/manage-users#web-v8_3
    const { loading, user } = useAuth()
    const router = useRouter()

    // Implement the redirecting as an effect
    // Doing it during rendering (ex: in the if/else statement below)
    // would result in a Unhandled RuntimeError.
    useEffect(() => {

        // only care about auth if specified
        if (!props.withAuth) {
            return
        }

        if (!loading && !user) {
            // if it is not loading and user is null -> redirect to login page
            router.replace('/login')
        }
    }, [loading, user])

    let body: JSX.Element

    if (props.withAuth && !user) {
        // render loading page
        body = <Loading label="Loading..." />
    } else if (props.noAppHeader) {
        // render page without header
        body = <>{props.children}</>
    } else {
        // render page with header
        body = <>{props.children}</>
    }

    return (
        <>
            <Head>
                <title>{props.title}</title>
            </Head>
            <Container maxWidth='xl'>
                {body}
            </Container>
        </>
    )
}

export default Page