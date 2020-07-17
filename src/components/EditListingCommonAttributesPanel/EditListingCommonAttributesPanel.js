import React from 'react';
import { bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from '../../util/reactIntl';
import { ensureOwnListing } from '../../util/data';
import { findOptionsForSelectFilter } from '../../util/search';
import { LISTING_STATE_DRAFT } from '../../util/types';
import { ListingLink } from '..';
import { EditListingCommonAttributesForm } from '../../forms';
import config from '../../config';

import css from './EditListingCommonAttributesPanel.css';

const EditListingCommonAttributesPanel = props => {
  const {
    className,
    rootClassName,
    listing,
    disabled,
    ready,
    onSubmit,
    onChange,
    submitButtonText,
    panelUpdated,
    updateInProgress,
    errors,
  } = props;

  const classes = classNames(rootClassName || css.root, className);
  const currentListing = ensureOwnListing(listing);
  const { description, title, publicData } = currentListing.attributes;

  const isPublished = currentListing.id && currentListing.attributes.state !== LISTING_STATE_DRAFT;
  const panelTitle = isPublished ? (
    <FormattedMessage
      id="EditListingCommonAttributesPanel.title"
      values={{ listingTitle: <ListingLink listing={listing} /> }}
    />
  ) : (
    <FormattedMessage id="EditListingCommonAttributesPanel.createListingTitle" />
  );

  const categoryOptions = findOptionsForSelectFilter('category', config.custom.filters);
  return (
    <div className={classes}>
      <h1 className={css.title}>{panelTitle}</h1>
      <EditListingCommonAttributesForm
        className={css.form}
        initialValues={{ title, description, category: publicData.category, education_category: publicData.education_category }}
        //initialValues={{ education_category: publicData.education_category }}
        saveActionMsg={submitButtonText}
        onSubmit={values => {
          const { title, description, category, education_category } = values;
          //const { education_category } = values;
          const updateValues = {
            title: title.trim(),
            description,
            publicData: { education_category, category },
            //publicData: { education_category },
          };

          onSubmit(updateValues);
        }}
        onChange={onChange}
        disabled={disabled}
        ready={ready}
        updated={panelUpdated}
        updateInProgress={updateInProgress}
        fetchErrors={errors}
        categories={categoryOptions}
        isPublished={isPublished}
      />
    </div>
  );
};

EditListingCommonAttributesPanel.defaultProps = {
  className: null,
  rootClassName: null,
  errors: null,
  listing: null,
};

EditListingCommonAttributesPanel.propTypes = {
  className: string,
  rootClassName: string,

  // We cannot use propTypes.listing since the listing might be a draft.
  listing: object,

  disabled: bool.isRequired,
  ready: bool.isRequired,
  onSubmit: func.isRequired,
  onChange: func.isRequired,
  submitButtonText: string.isRequired,
  panelUpdated: bool.isRequired,
  updateInProgress: bool.isRequired,
  errors: object.isRequired,
};

export default EditListingCommonAttributesPanel;
