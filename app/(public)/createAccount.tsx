import CreateAccount from '@/components/pages/CreateAccount'
import PageWrapper from '@/components/wrapper/PageWrapper'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

type Props = {}

const createAccount = (props: Props) => {
  return (
    <PageWrapper>
              <StatusBar style="dark" />
      
        <CreateAccount/>
    </PageWrapper>
  )
}

export default createAccount