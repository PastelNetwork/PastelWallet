import React, {Component} from 'react';
import {MainWrapperContainer} from "../containers/MainWrapperContainer";

export class SendPSL extends Component {
    render() {
        return <MainWrapperContainer>
            <section className="flex-row wrap">
                <div className="flex-col half addreses">
                    Send PSL Form
                </div>
            </section>
        </MainWrapperContainer>;
    }
}
