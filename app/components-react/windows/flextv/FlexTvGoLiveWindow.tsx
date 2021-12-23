import React, { useState, useEffect } from 'react';
import { Spin } from 'antd'
import { ModalLayout } from '../../shared/ModalLayout';
import { Button } from 'antd';
import { useOnCreate, useOnDestroy } from '../../hooks';
import { Services } from '../../service-provider';
import { $t } from '../../../services/i18n';
import Form from '../../shared/inputs/Form';
import { alertAsync } from '../../modals';
import { NumberInput, TextInput, RadioInput, CheckboxInput, ListInput } from '../../shared/inputs';
import { useGoLiveSettingsRoot } from '../go-live/useGoLiveSettings';

export default function FlexTvGoLiveWindow() {
  const { StreamingService, WindowsService, FlexTvService } = Services;
  const {
    error,
    lifecycle,
    checklist,
    goLive,
    isLoading,
    prepopulate,
    updateSettings,
    form,
  } = useGoLiveSettingsRoot().select();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('5');
  const [resolution, useResolution] = useState('720');
  const [useMinFanLevel, setUseMinFanLevel] = useState('false');
  const [minRatingLevel, setMinFanLevel] = useState('1');
  const [isForAdult, setIsForAdult] = useState(false);
  const [isSecret, setIsSecret] = useState(false);
  const [password, setPassword] = useState('');
  const [maxUserCount, setMaxUserCount] = useState(300);

  const shouldShowConfirm = ['prepopulate', 'waitForNewSettings'].includes(lifecycle);

  // clear failed checks and warnings on window close
  useOnDestroy(() => {
    if (checklist.startVideoTransmission !== 'done') {
      StreamingService.actions.resetInfo();
    }
  });

  useOnCreate(() => {
    prepopulate();
  });

  useEffect(() => {
    FlexTvService.fetchStreamConfig().then(streamOptions => {
      if (!streamOptions) return;

      setTitle(streamOptions.title ?? '');
      setTheme(streamOptions.theme ?? '5');
      setIsSecret(!!streamOptions.password);
      setPassword(streamOptions.password ?? '');
      setIsForAdult(streamOptions.isForAdult ?? false);
    });
  }, []);

  function close() {
    WindowsService.actions.closeChildWindow();
  }

  async function handleConfirm() {
    if (!title) {
      return alertAsync('방속제목을 입력해 주세요');
    }
    updateSettings({
      platforms: {
        flextv: {
          enabled: true,
          useCustomFields: true,
          title,
          theme,
          resolution,
          minRatingLevel:
            useMinFanLevel === 'true' && minRatingLevel ? Number(minRatingLevel) : undefined,
          password,
          isForAdult,
        },
      },
    });
    setLoading(true);
    try {
      await goLive();
    } catch (_e: unknown) {
      setLoading(false);
    }
    close();
  }

  function renderFooter() {
    return (
      <Form layout={'inline'}>
        {/* CLOSE BUTTON */}
        <Button onClick={close}>{$t('Close')}</Button>
        {/* GO LIVE BUTTON */}
        {shouldShowConfirm && (
          <Button type="primary" onClick={handleConfirm} disabled={loading || !!error}>
            {$t('Confirm & Go Live')}
          </Button>
        )}
      </Form>
    );
  }

  return (
    <ModalLayout footer={renderFooter()}>
      <Spin spinning={loading}>
        <Form
          form={form}
          style={{
            position: 'relative',
            height: '100%',
          }}
          layout="vertical"
          name="editStreamForm"
        >
          <div className="section thin">
            <TextInput label={'방송제목'} value={title} onChange={setTitle} />
          </div>
          <div className="section thin">
            <RadioInput
              label={'카테고리'}
              options={[
                {
                  value: '5',
                  label: '토크방',
                },
                {
                  value: '7',
                  label: '19+',
                },
              ]}
              value={theme}
              onChange={setTheme}
            />
          </div>
          <div className="section thin">
            <RadioInput
              label={'방송형태'}
              options={[
                {
                  value: 'false',
                  label: '일반방송',
                },
                {
                  value: 'true',
                  label: '팬방송',
                },
              ]}
              value={useMinFanLevel}
              onChange={setUseMinFanLevel}
            />
            {useMinFanLevel === 'true' && (
              <ListInput
                label={'팬 최소 등급'}
                value={minRatingLevel}
                onChange={setMinFanLevel}
                options={[
                  {
                    label: 'BRONZE',
                    value: '1',
                  },
                  {
                    label: 'SILVER',
                    value: '2',
                  },
                  {
                    label: 'GOLD',
                    value: '3',
                  },
                  {
                    label: 'RUBY',
                    value: '4',
                  },
                  {
                    label: 'DIAMOND',
                    value: '5',
                  },
                ]}
              />
            )}
          </div>
          <div className="section thin">
            <h3 className="section-title">{'방송속성'}</h3>
            <CheckboxInput label={'연령제한'} value={isForAdult} onChange={setIsForAdult} />
            <CheckboxInput label={'비밀번호방'} value={isSecret} onChange={setIsSecret} />
          </div>
          {isSecret ? (
            <div style={{ paddingLeft: 30 }}>
              <TextInput label={'비밀번호'} value={password} onChange={setPassword} />
            </div>
          ) : null}
          <div className="section thin">
            <RadioInput
              label={'방송화질'}
              options={[
                {
                  value: '720',
                  label: '일반화질',
                },
                {
                  value: '1080',
                  label: '고화질(1080p)',
                },
              ]}
              value={resolution}
              onChange={useResolution}
            />
          </div>
          <div className="section thin">
            <NumberInput
              label={'유저 수'}
              value={maxUserCount}
              onChange={setMaxUserCount}
              max={700}
            />
          </div>
        </Form>
      </Spin>
    </ModalLayout>
  );
}
