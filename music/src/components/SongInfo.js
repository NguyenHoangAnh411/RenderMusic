import React from 'react';

export default function SongInfo() {

    return (
        <div style={{marginTop: '1%', marginLeft: '1.5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', width: '25%', alignItems: 'center'}}>
                <div style={{flex: 1}}>#</div>
                <div style={{flex: 3}}>Title</div>
            </div>
            <div style={{width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><span>Album</span></div>
            <div style={{width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Added At</div>
            <div style={{width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Control</div>
        </div>
    );
    
}